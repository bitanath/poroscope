import json
from calculus import *

def get_json_size(match_details):
    response_json = json.dumps(match_details)
    size_mb = len(response_json.encode('utf-8')) / (1024 * 1024)
    return size_mb


def top_line_metrics(matches,puuid_set):
    result = {}
    result['hours_played'] = total_hours_played(matches)
    result['longest_streak_days'] = longest_streak_days(matches)
    result['longest_win_streak'] = longest_win_streak(matches,puuid_set)
    result['classic_games_stats'] = classic_games_stats(matches, puuid_set)
    result['aram_games_stats'] = aram_games_stats(matches, puuid_set)
    result['arena_games_stats'] = arena_games_stats(matches, puuid_set)
    result['kills_deaths_assists'] = kills_deaths_assists(matches, puuid_set)
    result['avg_gold_earned_per_minute'] = avg_gold_earned_per_minute(matches, puuid_set)
    result['avg_damage_dealt_per_minute'] = avg_damage_dealt_per_minute(matches, puuid_set)
    result['avg_gold_spent_per_minute'] = avg_gold_spent_per_minute(matches, puuid_set)
    result['avg_damage_taken_per_minute'] = avg_damage_taken_per_minute(matches, puuid_set)
    result['avg_damage_mitigated_per_minute'] = avg_damage_mitigated_per_minute(matches, puuid_set)
    result['hours_by_lane'] = hours_by_lane(matches, puuid_set)
    result['role_percentage'] = role_percentage(matches, puuid_set)
    return

def charts(matches,puuid_set):
    result = {}
    result['hot_streak'] = hot_streak(matches, puuid_set) 
    result['tilt_chart'] = tilt_chart(matches, puuid_set) 
    result['games_played_heatmap'] = games_played_heatmap(matches, puuid_set) 
    result['win_percentage_heatmap'] = win_percentage_heatmap(matches, puuid_set) 
    result['game_mode_win_percentage'] = game_mode_win_percentage(matches, puuid_set)
    result['team_lane_dominance'] = team_lane_dominance(matches, puuid_set)
    result['player_lane_dominance'] = player_lane_dominance(matches, puuid_set)
    return result


def player_metrics(matches,puuid_set):
    result = {}
    result['player_lane_dominance'] = player_lane_dominance(matches, puuid_set)
    result['damage_share'] = damage_share(matches, puuid_set)
    result['gold_share'] = gold_share(matches, puuid_set)
    result['healing_share'] = healing_share(matches, puuid_set)
    result['kill_participation'] = kill_participation(matches, puuid_set)
    result['damage_gini_coefficient'] = damage_gini_coefficient(matches, puuid_set)
    result['gold_gini_coefficient'] = gold_gini_coefficient(matches, puuid_set)
    result['performance_comparison'] = performance_comparison(matches, puuid_set)
    return result

def team_metrics(matches,puuid_set):
    result = {}
    result['objective_control_ratio'] = objective_control_ratio(matches, puuid_set)
    result['ping_to_action_ratio'] = ping_to_action_ratio(matches, puuid_set)
    result['vision_control_share'] = vision_control_share(matches, puuid_set)
    result['kill_participation_rate_assists_vs_kills'] = kill_participation_rate_assists_vs_kills(matches, puuid_set)
    result['first_objective_score'] = first_objective_score(matches, puuid_set)
    result['minion_killed_share'] = minion_killed_share(matches, puuid_set)
    result['epic_monster_damage_share'] = epic_monster_damage_share(matches, puuid_set)
    result['objective_control_share'] = objective_control_share(matches, puuid_set)
    return result

def champion_metrics(matches,puuid_set,champions,top_champion_masteries):
    result = {}
    result['top_champion_stats'] = top_champion_stats(matches, puuid_set, champions)
    result['top_team_champion_stats'] = top_team_champion_stats(matches, puuid_set, champions)
    result['top_banned_champions_vs_player'] = top_banned_champions_vs_player(matches, puuid_set, champions)
    result['estimated_champions_that_killed_player'] = estimated_champions_that_killed_player(matches, puuid_set, champions)
    result['mastery_vs_performance'] = mastery_vs_performance(matches, puuid_set, top_champion_masteries)
    return result
    