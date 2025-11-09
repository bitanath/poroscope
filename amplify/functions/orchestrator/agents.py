import json
from strands import Agent
from strands_tools import calculator
from strands.models import BedrockModel

from pydantic import BaseModel, Field
from typing import List

class ChampionInfo(BaseModel):
    """Model that describes the name of the champion and the area in which they excels"""
    name: str = Field(description="Name of the Champion")
    excels: str = Field(description="Areas in which the champion excels. This could be either team or individual, and span across damage, vision, gold, wins, kda or farmed")

class ChampionSummary(BaseModel):
    """Model that describes champions performance overall"""
    summary: str = Field(description="Two sentence summary specifying which champion stood out the most")
    champions: List[ChampionInfo] = Field(description="A List of Champions with name and excels fields")

class SummarySentence(BaseModel):
    """Summarize data into one single clever insight supported by an outstanding metric"""
    summary: str = Field(description="A single clever insight about the data")
    metric: str = Field(description="The metric supporting the clever insight")
    
def champion_agent(data,model):
    agent = Agent(
        model=model,
        system_prompt="You are a data analyst that takes input data about League of Legends champions as a dict and returns another structured data as a dict."
    )
    top_champion_data = data['champion_data']['top_champion_stats'] | data['champion_data']['top_team_champion_stats']

    answer = agent("Here is a list of LoL champions with their contribution either to individual player or to the team. Team contributions have _team in the name, individual contributions do not. I want you to summarize this data and return your analysis. Your output should have all unique champions. The champion excels in should have top gold, damage, wins, kda, vision or farmed. Make the summary sentence succinct with only one champion name. The champions field should contain all unique champions. Here is data. "+json.dumps(top_champion_data),structured_output_model=ChampionSummary)
    insight_champion = answer.structured_output.summary
    champions = [{'name': x.name, 'title': x.excels} for x in list(answer.structured_output.champions)]
    insight_banned = "These were the champions your team banned the most number of times 🫷"
    banned = [{'name': k, 'title': str(v) + ' bans'} for k, v in data['champion_data']['top_banned_champions_vs_player'].items()]
    insight_nemesis = "These were the champions that hurt you the most 💀"
    nemesis = [{'name': k, 'title': str(v) + ' kills'} for k, v in data['champion_data']['estimated_champions_that_killed_player'].items()]
    return {
        "insight_champion" : insight_champion,
        "insight_nemesis" : insight_nemesis,
        "insight_banned" : insight_banned,
        "champions" : champions,
        "nemesis" : nemesis,
        "banned" : banned
    }

def mastery_agent(data,model):
    champion_mastery_data = data['champion_data']['mastery_vs_performance']
    agent = Agent(
        model=model,
        system_prompt="You are a data analyst that takes input data about League of Legends champions as a dict and returns another structured data as a dict. Your sentences should address a third person."
    )
    answer = agent("Here is a list of LoL champions with the player mastery as opposted to the actual player performance. I want you to summarize this data with insights about the champion mastery level versus actual player performance and return your analysis. Your output should have all unique champions. The excels in field should have few words but be in Plain English, highlighting the areas of excellent performance made by this champion for this player. Make the summary sentence succinct with only one champion name that leads the pack, you can also include a few words from the champion story. The final returned champions field should contain all unique champions. Here is data. "+json.dumps(champion_mastery_data),structured_output_model=ChampionSummary)
    insight_mastery = answer.structured_output.summary
    mastery = [{'name': x.name, 'title': x.excels} for x in list(answer.structured_output.champions)]
    return {
        "insight_mastery" : insight_mastery,
        "mastery" : mastery
    }

def topline_agent(data,model):
    topline_data = data['topline_data']
    agent = Agent(
        model=model,
        system_prompt="You are a summarizer that takes structured data as a dict and returns sentences in plain english describing clever insights. Your sentences should address a third person."
    )
    answer = agent("This is data containing several metrics about a player. Find a clever insight, supported by a metric, and present it to the player. Address the player directly with 'You'. Here is data. Be as succinct as possible. Make it fun!"+json.dumps(topline_data),structured_output_model=SummarySentence)
    insight_topline = answer.structured_output.summary
    metric_topline = answer.structured_output.metric
    return {
        "insight_topline" : insight_topline,
        "metric_topline" : metric_topline
    }

def player_agent(data,model):
    player_data = data['player_data']
    agent = Agent(
        model=model,
        system_prompt="You are a summarizer that takes structured data as a dict and returns sentences in plain english describing clever insights. Your sentences should address a third person."
    )
    answer = agent("This is data containing several metrics about a player. Find a clever insight, supported by a metric, and present it to the player. Address the player directly with 'You'. Here is data. Use as few words as possible. Make it fun!"+json.dumps(player_data),structured_output_model=SummarySentence)
    insight_player = answer.structured_output.summary
    metric_player = answer.structured_output.metric
    return {
        "insight_player" : insight_player,
        "metric_player" : metric_player
    }

def team_agent(data,model):
    team_data = data['team_data']
    agent = Agent(
        model=model,
        system_prompt="You are a summarizer that takes structured data as a dict and returns sentences in plain english describing clever insights. Your sentences should address a third person."
    )
    answer = agent("This is data containing several metrics about a team of players playing League of Legends. Find a clever insight, supported by a metric, and present it to the player. Address the player directly with 'Your Tean'. Here is data. Use as few words as possible. Make it fun!"+json.dumps(team_data),structured_output_model=SummarySentence)
    insight_team = answer.structured_output.summary
    metric_team = answer.structured_output.metric
    return {
        "insight_team" : insight_team,
        "metric_team" : metric_team
    }


def fetch_insights(data):
    model = BedrockModel(model_id="us.amazon.nova-micro-v1:0", max_tokens=4096, temperature=0.1, top_p=0.9)

    assert {'champion_data', 'topline_data', 'player_data', 'team_data'}.issubset(data.keys())

    data['champion_mastery'] = mastery_agent(data,model)
    data['champion_data'] = champion_agent(data,model)
    data['topline_insights'] = topline_agent(data,model)
    data['player_insights'] = player_agent(data,model)
    data['team_insights'] = team_agent(data,model)

    return data


