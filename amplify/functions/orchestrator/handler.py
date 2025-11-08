import json
import boto3
import logging
import requests

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

def get_champion_masteries(puuid_valkyrie):
    api_key = get_secret('VALKYRIE_RIOT_API_KEY')
    headers = {
        "X-Riot-Token": api_key
    }
    url = f"https://na1.api.riotgames.com//lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid_valkyrie}/top?count=10"
    response = requests.get(url, headers=headers)
    top_champion_masteries = response.json()
    versions = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()
    latest_version = versions[0]
    raw_champions = requests.get(f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/data/en_US/champion.json")
    champions = raw_champions.json()
    champions = [{"id":c['key'],"name":c['id'],"story":c['blurb']} for c in champions['data'].values()]
    champion_lookup = {int(champ['id']): champ for champ in champions}

    for mastery in top_champion_masteries:
        champion_id = mastery['championId']
        champion = champion_lookup.get(champion_id, {})
        mastery['championName'] = champion.get('name', 'Unknown')
        mastery['championStory'] = champion.get('story', '')


def handler(event, context):
    lambda_client = boto3.client('lambda')
    
    try:
        name = event.get('name')
        [game_name,tag_line] = name.split("#")

        summoner_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-mai-summonerfetcher0450063D-jznr0idRQ0bH',
            InvocationType='RequestResponse',
            Payload=json.dumps({'fullName': name})
        )
        summoner_data = json.loads(summoner_response['Payload'].read())
        puuid = json.loads(summoner_data['body'])['puuid']

        puuid_set = get_puuid_set(game_name,tag_line)
        
        logger.info("Calling match-fetcher... "+"<-->".join(puuid_set))
        match_response = lambda_client.invoke(
            FunctionName='amplify-d17o49q02hg78d-main-b-matchfetcher999CBB2E-gPkiyXEK4b8T',
            InvocationType='RequestResponse',
            Payload=json.dumps({'puuid': puuid})
        )
        
        match_data = json.loads(match_response['Payload'].read())
        logger.info("Done with match-fetcher... "+match_data['body'])

        matches = json.loads(match_data['body'])['match_count']
        message = json.loads(match_data['body'])['message']
        size_mb = json.loads(match_data['body'])['size_mb']
        
        logger.info("Called and got totals... "+str(matches))

        get_champion_masteries(puuid_set[0])

        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'matches_count': matches,
                'message': message,
                'size_mb': size_mb
            })
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }