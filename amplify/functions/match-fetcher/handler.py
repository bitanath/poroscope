import datetime
import requests
import logging
import random
import boto3
import json
import time
import os
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret(secret_name):
    client = boto3.client('ssm')
    parameter_name = f"/amplify/shared/d17o49q02hg78d/{secret_name}"
    response = client.get_parameter(Name=parameter_name, WithDecryption=True)
    return response['Parameter']['Value']

def fetch_page(page, puuid, headers):
    specific_datetime = datetime.datetime(2025, 1, 1, 1, 1, 1)
    epoch_start = int(specific_datetime.timestamp())
    specific_datetime = datetime.datetime(2026, 1, 1, 1, 1, 1)
    epoch_end = int(specific_datetime.timestamp())
    start = page * 100
    response = requests.get(
        f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start={start}&count=100&startTime={epoch_start}&endTime={epoch_end}",
        headers=headers
    )
    return response.json()

def get_all_matches_played(puuid, headers):
    all_matches = []
    page = 0
    logger.info("Starting to get match ids")
    with ThreadPoolExecutor(max_workers=4) as executor:
        while True:
            futures = []
            for i in range(4):
                futures.append(executor.submit(fetch_page, page + i, puuid, headers))
            
            results = [future.result() for future in futures]
            
            if any(not result for result in results):
                for result in results:
                    if result:
                        all_matches.extend(result)
                break
            
            for result in results:
                all_matches.extend(result)
            
            page += 4
    return all_matches

def del_metadata(match):
    if match.get('metadata'):
            del match['metadata']
        
    for p in match['info']['participants']:
        del p['PlayerScore0']
        del p['PlayerScore1']
        del p['PlayerScore10']
        del p['PlayerScore11']
        del p['PlayerScore2']
        del p['PlayerScore3']
        del p['PlayerScore4']
        del p['PlayerScore5']
        del p['PlayerScore6']
        del p['PlayerScore7']
        del p['PlayerScore8']
        del p['PlayerScore9']
        del p['challenges']
        del p['perks']
        del p['missions']
    return match

def fetch_match_detail(match_id,api_keys):
    headers = {
        "X-Riot-Token": random.choice(api_keys)
    }
    
    response = requests.get(f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
    
    if response.status_code == 200:
        match = response.json()
        match = del_metadata(match)
        return match
    elif response.status_code == 429:
        retry_after = min(int(response.headers.get('Retry-After', 1)), 5)
        time.sleep(retry_after)
        headers = {
            "X-Riot-Token": random.choice(api_keys)
        }
    
        response = requests.get(f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
        return del_metadata(response.json()) if response.status_code == 200 else None
    
    return None

def get_all_match_details(match_ids):
    all_details = []
    api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
    logger.info("Starting to get match details")
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = [executor.submit(fetch_match_detail, match_id,api_keys) for match_id in match_ids]
        all_details = [future.result() for future in futures if future.result()]
    
    return all_details

def handler(event, context):
    try:
        puuid = event.get('puuid')
        if not puuid:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'puuid is required'})
            }
        
        api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
        headers = {
            "X-Riot-Token": random.choice(api_keys)
        }
        
        match_ids = get_all_matches_played(puuid, headers)
        logger.info(f"Got {len(match_ids)} matches played")
        match_details = get_all_match_details(match_ids)
        logger.info(f"Got {len(match_details)} matches details for all")
        response_json = json.dumps(match_details)
        size_mb = len(response_json.encode('utf-8')) / (1024 * 1024)
        return {
            'statusCode': 200,
            'body': json.dumps({
                'match_count': len(match_details),
                'message': f'Processed {len(match_details)} matches successfully',
                'size_mb': size_mb
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
