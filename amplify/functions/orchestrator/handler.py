import os
import json
import boto3
import base64
import logging
import hashlib
import requests

from agents import fetch_insights
from concurrent.futures import ThreadPoolExecutor,as_completed

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret(secret_name):
    client = boto3.client('ssm')
    parameter_name = f"/amplify/shared/d17o49q02hg78d/{secret_name}"
    response = client.get_parameter(Name=parameter_name, WithDecryption=True)
    return response['Parameter']['Value']

def get_mega_region(region: str) -> str:
    region_map = {
        'BR1': 'americas',
        'LA1': 'americas', 
        'LA2': 'americas',
        'NA1': 'americas',
        'OC1': 'americas',
        'EUN1': 'europe',
        'EUW1': 'europe',
        'ME1': 'europe',
        'RU': 'europe',
        'TR1': 'europe',
        'JP1': 'asia',
        'KR': 'asia',
        'SG2': 'asia',
        'TW2': 'asia',
        'VN2': 'asia'
    }
    
    return region_map[region]

def get_puuid_set(game_name,tag_line,mega):
    api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
    
    def fetch_puuid(api_key):
        url = f"https://{mega}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"   
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
        name = event['arguments'].get('name')
        region = event['arguments'].get('region')  if event['arguments'].get('region') is not None else 'NA1'
        delete_cache = event['arguments'].get('delete', False)
        make_public = event['arguments'].get('publicize', False)
        cacher = event['arguments'].get('cacheKey')
        mega = get_mega_region(region) if region is not None else 'americas'

        [game_name,tag_line] = name.split("#") if name is not None else ["a","b"]

        dynamodb = boto3.resource('dynamodb')
        table_name = 'CACHE_REPORTS'
        cache_table = dynamodb.Table(table_name)
        cache_key = base64.b64encode(f"{name}-{region}".encode()).decode() if cacher is None else cacher
        logger.info("Found cache table now checking cache_key "+cache_key)
        
        try:
            response = cache_table.get_item(Key={'id': cache_key})
            if 'Item' in response:
                logger.info("Cache item found, fetching from there")
                if delete_cache:
                    try:
                        cache_table.delete_item(Key={'id': cache_key})
                        logger.info("Deleted cache item")
                        return {
                            'statusCode': 200,
                            'body': "deleted successfully"
                        }
                    except:
                        logger.error("Error while deleting cache item")
                        return {
                            'statusCode': 424,
                            'body': "unable to delete due to internal error"
                        }
                elif make_public:
                    try:
                        item = response['Item']
                        item['public'] = True
                        cache_table.put_item(Item=item)
                    except:
                        pass
                elif cacher is not None and not response['Item']['public']:
                    return {
                        'statusCode': 401,
                        'body': "Not a public report"
                    }
                else:
                    return {
                        'statusCode': 200,
                        'body': response['Item']['data']
                    }
            elif cacher is not None:
                return {
                            'statusCode': 404,
                            'body': "unable to find the cached report provided"
                        }
        except:
            pass
        
        
        puuid_set = get_puuid_set(game_name,tag_line,mega)
        logger.info(f"Now invoking match data with puuids {'<-->'.join(puuid_set)}")
        match_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-main-b-matchfetcher999CBB2E-gPkiyXEK4b8T',
            InvocationType='RequestResponse',
            Payload=json.dumps({'arguments': {'puuid_set':puuid_set,'region':region}})
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
        logger.info("Sending message to agent")
        message = fetch_insights(body)
        logger.info("Got insights from agent")
        try:
            logger.info("Putting item in cache "+cache_key)
            cache_table.put_item(
                Item={
                    'id': cache_key,
                    'data': json.dumps(message)
                }
            )
        except Exception as e:
            logger.info(f"Errored out while caching : {str(e)}")
            pass
        return {
            'statusCode': 200,
            'body': json.dumps(message)
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }