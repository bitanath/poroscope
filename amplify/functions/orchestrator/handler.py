import os
import json
import boto3
import logging
import requests

from strands import Agent
from strands_tools import calculator
from strands.models import BedrockModel
from concurrent.futures import ThreadPoolExecutor,as_completed

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret(secret_name):
    client = boto3.client('ssm')
    parameter_name = f"/amplify/shared/d17o49q02hg78d/{secret_name}"
    response = client.get_parameter(Name=parameter_name, WithDecryption=True)
    return response['Parameter']['Value']

def get_puuid_set(game_name,tag_line):
    api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
    
    def fetch_puuid(api_key):
        url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"   
        headers = {"X-Riot-Token": api_key}
        response = requests.get(url, headers=headers)
        puuid = response.json().get('puuid')
        return puuid if puuid else None
    
    puuid_set = []
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_puuid, api_key) for api_key in api_keys]
        for future in futures:
            puuid = future.result()
            if puuid:
                puuid_set.append(puuid)
    
    return puuid_set


def handler(event, context):
    lambda_client = boto3.client('lambda')
    os.environ['AWS_BEARER_TOKEN_BEDROCK'] = get_secret('AWS_BEARER_TOKEN_BEDROCK')
    
    try:
        name = event.get('name')
        [game_name,tag_line] = name.split("#")

        puuid_set = get_puuid_set(game_name,tag_line)
        logger.info("Now invoking match data with puuids")
        match_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-main-b-matchfetcher999CBB2E-gPkiyXEK4b8T',
            InvocationType='RequestResponse',
            Payload=json.dumps({'puuid_set': puuid_set})
        )
        logger.info("Got back a match response...")
        match_data = json.loads(match_response['Payload'].read())
        logger.info("Done with match-fetching... "+get_secret('AWS_BEARER_TOKEN_BEDROCK'))
        body = json.loads(match_data['body'])
        status = match_data['statusCode']
        
        logger.info("Called and got analysed data... now to analyse using agent")
        if(status != 200):
            return {
                'statusCode': status,
                'body': json.dumps({'error': f'Unable to get matches for {name}'})
            }
        
        #Now analyse using a strands agent
        model = BedrockModel(model_id="us.amazon.nova-micro-v1:0",
                temperature=0.1,
                top_p=0.9)
        agent = Agent(
            model=model,
            system_prompt="You are a helpful assistant."
        )
        answer = agent("Hello World")
        return {
            'statusCode': 200,
            'message': answer.message['content'][0]['text'],
            'body': json.dumps(body)
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }