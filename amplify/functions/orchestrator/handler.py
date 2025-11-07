import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    lambda_client = boto3.client('lambda')
    
    try:
        name = event.get('name')
        summoner_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-mai-summonerfetcher0450063D-jznr0idRQ0bH',
            InvocationType='RequestResponse',
            Payload=json.dumps({'fullName': name})
        )
        summoner_data = json.loads(summoner_response['Payload'].read())
        puuid = json.loads(summoner_data['body'])['puuid']
        
        logger.info("Calling match-fetcher... "+puuid)
        match_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-main-b-matchfetcher999CBB2E-gPkiyXEK4b8T',
            InvocationType='RequestResponse',
            Payload=json.dumps({'puuid': puuid})
        )
        
        match_data = json.loads(match_response['Payload'].read())
        matches = json.loads(match_data['body'])['match_count']
        
        logger.info("Called and got totals... "+str(matches))
        
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'matches_count': matches
            })
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }