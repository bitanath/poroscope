import datetime
import requests
import logging
import random
import boto3
import json
import time
import os

from analysis import charts,top_line_metrics,player_metrics,team_metrics,champion_metrics,get_json_size
# from champy import get_champions,get_champion_masteries
from concurrent.futures import ThreadPoolExecutor
from metad import del_metadata

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_champions():
    versions = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()
    latest_version = versions[0]
    raw_champions = requests.get(f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/data/en_US/champion.json")
    champions = raw_champions.json()
    champions = [{"id":c['key'],"name":c['id'],"story":c['blurb']} for c in champions['data'].values()]
    return champions

def get_champion_masteries(api_key,puuid_valkyrie,champions):
    logger.info("Getting champions masteries")
    headers = {
        "X-Riot-Token": api_key
    }
    url = f"https://na1.api.riotgames.com//lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid_valkyrie}/top?count=10"
    response = requests.get(url, headers=headers)
    top_champion_masteries = response.json()
    logger.info("Got top champions masteries")
    champion_lookup = {int(champ['id']): champ for champ in champions}

    for mastery in top_champion_masteries:
        champion_id = mastery['championId']
        champion = champion_lookup.get(champion_id, {})
        mastery['championName'] = champion.get('name', 'Unknown')
        mastery['championStory'] = champion.get('story', '')

    return top_champion_masteries

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

def fetch_match_detail(match_id):
    api_keys = [get_secret('VALKYRIE_RIOT_API_KEY'), get_secret('DISABLOT_RIOT_API_KEY'), get_secret('RIGSTHULA_RIOT_API_KEY'), get_secret('RAGNAROK_RIOT_API_KEY'), get_secret('LIFTHRASIR_RIOT_API_KEY')]
    headers = {
        "X-Riot-Token": random.choice(api_keys)
    }
    
    response = requests.get(f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
    
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
    
        response = requests.get(f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}", headers=headers)
        return del_metadata(response.json()) if response.status_code == 200 else None
    
    return None

def get_all_match_details(match_ids):
    all_details = []
   
    logger.info("Starting to get match details")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(fetch_match_detail, match_id) for match_id in match_ids]
        all_details = [future.result() for future in futures if future.result()]
    
    return all_details

def handler(event, context):
    try:
        puuid = event.get('puuid')
        puuid_set = event.get('puuid_set')
        if not puuid and not puuid_set:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'puuid is required'})
            }
        elif not puuid:
            puuid_set = list(puuid_set)
            puuid = puuid_set[0] #guaranteed to be Valkyrie
        
        default_api_key = get_secret('VALKYRIE_RIOT_API_KEY')
        headers = {
            "X-Riot-Token": default_api_key
        }
        
        match_ids = get_all_matches_played(puuid, headers)
        logger.info(f"Heckin yeah, Got {len(match_ids)} matches played")
        match_details = get_all_match_details(match_ids)

        logger.info(f"Heckin yeah, Got {len(match_details)} matches details for all")
        size_mb = get_json_size(match_details) #Just needs to be <6 MB

        #NOTE XXX - convert all puuid set to lowercase in order to do analysis (since case insensitivity happens sometimes)
        puuid_set = set([item.lower() for item in puuid_set]) if puuid_set is not None else set([puuid])
        #TODO Now get champion data for analysis
        champions = get_champions()
        logger.info(f"Got {len(champions)} champions")
        logger.info(f"Now fetching champion masteries {default_api_key} {puuid} {champions[0]['name']}")
        top_champion_masteries = get_champion_masteries(default_api_key,puuid,champions)
        logger.info(f"Got mastery champions...")

        #TODO now to get analysis
        logger.info("Now doing analysis...")
        # champion_data = champion_metrics(match_details,puuid_set,champions,top_champion_masteries)
        # logger.info("Got champion data")
        topline_data = top_line_metrics(match_details,puuid_set)
        logger.info("Got top line data")
        player_data = player_metrics(match_details,puuid_set)
        logger.info("Got player data")
        team_data = team_metrics(match_details,puuid_set)
        logger.info("Got team data")
        chart_data = charts(match_details,puuid_set)
        logger.info("Got chart data")

        
        return {
            'statusCode': 200,
            'body': json.dumps({
                # 'champion_data': champion_data,
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
