import datetime
import requests
import random
import boto3
import json
import time
import os
from concurrent.futures import ThreadPoolExecutor

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

def fetch_summoner(fullName,region,mega):
    api_key = get_secret('VALKYRIE_RIOT_API_KEY')
    headers = {
        "X-Riot-Token": api_key
    }
    [game_name,tag_line] = fullName.split("#")
    url = f"https://{mega}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    response = requests.get(url, headers=headers)
    if(response.status_code != 200): raise Exception(f"Unable to fetch riot id by {game_name} and #{tag_line} for {mega} - {region}")
    player_dict = response.json()
    puuid = player_dict['puuid']

    url = f"https://{region.lower()}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    response = requests.get(url, headers=headers)
    summoner_dict = response.json()
    profileIconId = summoner_dict['profileIconId']
    summonerLevel = summoner_dict['summonerLevel']

    if(summonerLevel < 1): raise Exception(f"Level too low: {game_name} and #{tag_line}")

    versions = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()
    latest_version = versions[0]
    profile_icon_url = f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/img/profileicon/{profileIconId}.png"
    summoner_dict['name'] = game_name
    summoner_dict['tag'] = tag_line
    summoner_dict['profile_icon_url'] = profile_icon_url
    return summoner_dict

def handler(event, context):
    try:
        fullName = event['arguments'].get('fullName')
        region = event['arguments'].get('region')  if event['arguments'].get('region') is not None else 'NA1'
        mega = get_mega_region(region) if region is not None else 'americas'
        if not fullName:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'fullName is required'})
            }
        
        summoner_dict = fetch_summoner(fullName,region,mega)
        return {
            'statusCode': 200,
            'body': json.dumps(summoner_dict)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
