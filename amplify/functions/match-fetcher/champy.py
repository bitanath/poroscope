import requests

def get_champions():
    versions = requests.get("https://ddragon.leagueoflegends.com/api/versions.json").json()
    latest_version = versions[0]
    raw_champions = requests.get(f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/data/en_US/champion.json")
    champions = raw_champions.json()
    champions = [{"id":c['key'],"name":c['id'],"story":c['blurb']} for c in champions['data'].values()]
    return champions

def get_champion_masteries(api_key,puuid_valkyrie,champions):
    
    headers = {
        "X-Riot-Token": api_key
    }
    url = f"https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid_valkyrie}/top?count=10"
    response = requests.get(url, headers=headers)
    
    top_champion_masteries = response.json()
    
    champion_lookup = {int(champ['id']): champ for champ in champions}
    
    for mastery in top_champion_masteries:
        champion_id = mastery['championId']
        champion = champion_lookup.get(champion_id, {})
        mastery['championName'] = champion.get('name', 'Unknown')
        mastery['championStory'] = champion.get('story', '')
    
    return top_champion_masteries