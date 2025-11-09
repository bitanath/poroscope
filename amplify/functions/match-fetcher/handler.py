import datetime
import requests
import logging
import random
import boto3
import json
import time
import os

from analysis import charts,top_line_metrics,player_metrics,team_metrics,champion_metrics,get_json_size
from champy import get_champions,get_champion_masteries
from concurrent.futures import ThreadPoolExecutor
from metad import del_metadata

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

def fetch_page(page, puuid, headers, mega):
    specific_datetime = datetime.datetime(2025, 1, 1, 1, 1, 1)
    epoch_start = int(specific_datetime.timestamp())
    specific_datetime = datetime.datetime(2026, 1, 1, 1, 1, 1)
    epoch_end = int(specific_datetime.timestamp())
    start = page * 100
    response = requests.get(
        f"https://{mega}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start={start}&count=100&startTime={epoch_start}&endTime={epoch_end}",
        headers=headers
    )
    return response.json()

def get_all_matches_played(puuid, headers, mega):
    all_matches = []
    page = 0
    logger.info("Starting to get match ids")
    with ThreadPoolExecutor(max_workers=4) as executor:
        while True:
            futures = []
            for i in range(4):
                futures.append(executor.submit(fetch_page, page + i, puuid, headers,mega))
            
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

def fetch_match_detail(match_id, mega):
    api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
    headers = {
        "X-Riot-Token": random.choice(api_keys)
    }
    
    response = requests.get(f"https://{mega}.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
    
    if response.status_code == 200:
        match = response.json()
        match = del_metadata(match)
        return match
    elif response.status_code == 429:
        retry_after = min(int(response.headers.get('Retry-After', 1)), 2)
        time.sleep(retry_after)
        headers = {
            "X-Riot-Token": random.choice(api_keys)
        }
    
        response = requests.get(f"https://{mega}.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
        return del_metadata(response.json()) if response.status_code == 200 else None
    
    return None

def get_all_match_details(match_ids, mega):
    all_details = []
   
    logger.info("Starting to get match details")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(fetch_match_detail, match_id, mega) for match_id in match_ids]
        all_details = [future.result() for future in futures if future.result()]
    
    return all_details

def handler(event, context):
    try:
        puuid = event['arguments'].get('puuid')
        puuid_set = event['arguments'].get('puuid_set')
        region = event['arguments'].get('region')  if event['arguments'].get('region') is not None else 'NA1'
        mega = get_mega_region(region) if region is not None else 'americas'

        if not puuid and not puuid_set:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'puuid is required'})
            }
        elif not puuid:
            puuid_set = list(puuid_set)
            puuid = puuid_set[-1] #guaranteed to be Valkyrie -> Ragnarok
        
        default_api_key = get_secret('LIFTHRASIR_RIOT_API_KEY')
        headers = {
            "X-Riot-Token": default_api_key
        }
        
        match_ids = get_all_matches_played(puuid, headers, mega)
        match_details = get_all_match_details(match_ids, mega)
        size_mb = get_json_size(match_details) #Just needs to be <6 MB if need to return

        #NOTE XXX - convert all puuid set to lowercase in order to do analysis (since case insensitivity happens sometimes)
        puuid_set = set([item.lower() for item in puuid_set]) if puuid_set is not None else set([puuid])
        #TODO Now get champion data and other metrics to pass on to AI for analysis
        champions = get_champions()
        top_champion_masteries = get_champion_masteries(default_api_key,puuid,champions,region)
        champion_data = champion_metrics(match_details,puuid_set,champions,top_champion_masteries)
        topline_data = top_line_metrics(match_details,puuid_set)
        player_data = player_metrics(match_details,puuid_set)
        team_data = team_metrics(match_details,puuid_set)
        chart_data = charts(match_details,puuid_set)

        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'champion_data': champion_data,
                'topline_data': topline_data,
                'player_data': player_data,
                'team_data': team_data,
                'chart_data': chart_data
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
