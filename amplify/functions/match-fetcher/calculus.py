import datetime
import numpy as np

#######################
## TOP LINE METRICS ##
#######################

def total_hours_played(matches):
    return round(sum(match['info']['gameDuration'] for match in matches) / 3600)


def longest_streak_days(matches):
    dates = sorted(set(match['info']['gameStartTimestamp'] // 86400000 for match in matches))
    if not dates:
        return 0
    
    max_streak = current_streak = 1
    for i in range(1, len(dates)):
        if dates[i] - dates[i-1] == 1:
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else:
            current_streak = 1
    
    return max_streak


def longest_win_streak(matches, puuid_set):
    sorted_matches = sorted(matches, key=lambda x: x['info']['gameStartTimestamp'])
    
    max_streak = current_streak = 0
    for match in sorted_matches:
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        if player['win']:
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else:
            current_streak = 0
    
    return max_streak

def classic_games_stats(matches, puuid_set):
    stats = {'played': 0, 'win': 0, 'loss': 0, 'abort': 0}
    
    for match in matches:
        if match['info']['gameMode'] != 'CLASSIC':
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        stats['played'] += 1
        
        is_abort = (match['info']['gameDuration'] < 300 or 
                   match['info']['endOfGameResult'] != 'GameComplete')
        
        if is_abort:
            stats['abort'] += 1
        elif player['win']:
            stats['win'] += 1
        else:
            stats['loss'] += 1
    
    return stats

def aram_games_stats(matches, puuid_set):
    stats = {'played': 0, 'win': 0, 'loss': 0, 'abort': 0}
    
    for match in matches:
        if match['info']['gameMode'] != 'ARAM':
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        stats['played'] += 1
        
        is_abort = (match['info']['gameDuration'] < 300 or 
                   match['info']['endOfGameResult'] != 'GameComplete')
        
        if is_abort:
            stats['abort'] += 1
        elif player['win']:
            stats['win'] += 1
        else:
            stats['loss'] += 1
    
    return stats

def arena_games_stats(matches, puuid_set):
    stats = {'played': 0, 'win': 0, 'loss': 0, 'abort': 0}
    
    for match in matches:
        if match['info']['gameMode'] != 'CHERRY':
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        stats['played'] += 1
        
        is_abort = (match['info']['gameDuration'] < 300 or 
                   match['info']['endOfGameResult'] != 'GameComplete')
        
        if is_abort:
            stats['abort'] += 1
        elif player['win']:
            stats['win'] += 1
        else:
            stats['loss'] += 1
    
    return stats

def kills_deaths_assists(matches):
    total_kills = sum(p['kills'] for match in matches for p in match['info']['participants'])
    total_deaths = sum(p['deaths'] for match in matches for p in match['info']['participants'])
    total_assists = sum(p['assists'] for match in matches for p in match['info']['participants'])
    
    return {
        'kills': total_kills,
        'deaths': total_deaths,
        'assists': total_assists
    }

def avg_gold_earned_per_minute(matches, puuid_set):
    total_gold = sum(p['goldEarned'] for match in matches for p in match['info']['participants']
                    if p['puuid'].lower() in puuid_set and 
                    not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    total_duration = sum(match['info']['gameDuration'] for match in matches 
                        if any(p['puuid'].lower() in puuid_set for p in match['info']['participants']) and
                        not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    return round((total_gold / (total_duration / 60)), 2)

def avg_damage_dealt_per_minute(matches, puuid_set):
    total_damage = sum(p['totalDamageDealtToChampions'] for match in matches for p in match['info']['participants']
                      if p['puuid'].lower() in puuid_set and 
                      not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    total_duration = sum(match['info']['gameDuration'] for match in matches 
                        if any(p['puuid'].lower() in puuid_set for p in match['info']['participants']) and
                        not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    return round((total_damage / (total_duration / 60)), 2)

def avg_gold_spent_per_minute(matches, puuid_set):
    total_spent = sum(p['goldSpent'] for match in matches for p in match['info']['participants']
                     if p['puuid'].lower() in puuid_set and 
                     not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    total_duration = sum(match['info']['gameDuration'] for match in matches 
                        if any(p['puuid'].lower() in puuid_set for p in match['info']['participants']) and
                        not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    return round((total_spent / (total_duration / 60)), 2)

def avg_damage_taken_per_minute(matches, puuid_set):
    total_taken = sum(p['totalDamageTaken'] for match in matches for p in match['info']['participants']
                     if p['puuid'].lower() in puuid_set and 
                     not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    total_duration = sum(match['info']['gameDuration'] for match in matches 
                        if any(p['puuid'].lower() in puuid_set for p in match['info']['participants']) and
                        not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    return round((total_taken / (total_duration / 60)), 2)

def avg_damage_mitigated_per_minute(matches, puuid_set):
    total_mitigated = sum(p['damageSelfMitigated'] for match in matches for p in match['info']['participants']
                         if p['puuid'].lower() in puuid_set and 
                         not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    total_duration = sum(match['info']['gameDuration'] for match in matches 
                        if any(p['puuid'].lower() in puuid_set for p in match['info']['participants']) and
                        not (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete'))
    return round((total_mitigated / (total_duration / 60)), 2)


#######################
## PLAYER SPECIFIC METRICS ##
#######################

def hours_by_lane(matches, puuid_set):
    lane_durations = {'BOTTOM': 0, 'UTILITY': 0, 'MIDDLE': 0, 'NONE': 0, 'TOP': 0, 'JUNGLE': 0}
    lane_keys = {'BOTTOM': "bottom", 'UTILITY': "support", 'MIDDLE': "mid", 'NONE': "other", 'TOP': "top", 'JUNGLE': "jungle"}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        for p in match['info']['participants']:
            if p['puuid'].lower() in puuid_set:
                lane = p['teamPosition'] or p['lane'] or 'NONE'
                if lane in lane_durations:
                    lane_durations[lane] += match['info']['gameDuration']
    
    # Convert to hours
    lane = {lane: round(duration / 3600, 0) for lane, duration in lane_durations.items()}
    most_common_lane = max(lane_durations.items(), key=lambda x: x[1])[0]
    
    return {
        'bottom': lane['BOTTOM'],
        'support': lane['UTILITY'], 
        'mid': lane['MIDDLE'],
        'other': lane['NONE'],
        'top': lane['TOP'],
        'jungle': lane['JUNGLE'],
        'most_common_lane': most_common_lane
    }


def role_percentage(matches, puuid_set):
    role_counts = {'BOTTOM': 0, 'UTILITY': 0, 'MIDDLE': 0, 'TOP': 0, 'JUNGLE': 0}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        for p in match['info']['participants']:
            if p['puuid'].lower() in puuid_set:
                role = p['teamPosition'] or p['lane']
                if role in role_counts:
                    role_counts[role] += 1
    
    total_role_games = sum(role_counts.values())
    if total_role_games == 0:
        return {'bottom': 0, 'support': 0, 'mid': 0, 'top': 0, 'jungle': 0}
    
    return {
        'bottom': round((role_counts['BOTTOM'] / total_role_games) * 100),
        'support': round((role_counts['UTILITY'] / total_role_games) * 100),
        'mid': round((role_counts['MIDDLE'] / total_role_games) * 100),
        'top': round((role_counts['TOP'] / total_role_games) * 100),
        'jungle': round((role_counts['JUNGLE'] / total_role_games) * 100)
    }


def hot_streak(matches, puuid_set):
    sorted_matches = sorted(matches, key=lambda x: x['info']['gameStartTimestamp'])
    
    game_results = []
    for match in sorted_matches:
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        timestamp_ms = match['info']['gameStartTimestamp']
        dt = datetime.datetime.fromtimestamp(timestamp_ms / 1000)
        formatted_time = dt.strftime("%d-%b")
        
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            status = 'abort'
        elif player['win']:
            status = 'win'
        else:
            status = 'loss'
            
        game_results.append({'datetime': formatted_time, 'status': status})
    
    # Find longest win streak from loss to loss
    max_streak = 0
    best_sequence = []
    
    for i, result in enumerate(game_results):
        if result['status'] == 'loss':
            # Look for next loss
            for j in range(i + 1, len(game_results)):
                if game_results[j]['status'] == 'loss':
                    # Count wins between losses
                    wins = sum(1 for k in range(i + 1, j) if game_results[k]['status'] == 'win')
                    if wins > max_streak:
                        max_streak = wins
                        best_sequence = game_results[i:j + 1]
                    break
    
    return best_sequence

def tilt_chart(matches, puuid_set):
    sorted_matches = sorted(matches, key=lambda x: x['info']['gameStartTimestamp'])
    
    # Build game results with timestamps
    game_results = []
    for match in sorted_matches:
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        timestamp_ms = match['info']['gameStartTimestamp']
        dt = datetime.datetime.fromtimestamp(timestamp_ms / 1000)
        formatted_time = dt.strftime("%d-%b")
        
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            status = 'abort'
        elif player['win']:
            status = 'win'
        else:
            status = 'loss'
            
        game_results.append({'datetime': formatted_time, 'status': status})
    
    # Find longest loss streak from win to win
    max_streak = 0
    best_sequence = []
    
    for i, result in enumerate(game_results):
        if result['status'] == 'win':
            # Look for next win
            for j in range(i + 1, len(game_results)):
                if game_results[j]['status'] == 'win':
                    # Count losses between wins
                    losses = sum(1 for k in range(i + 1, j) if game_results[k]['status'] == 'loss')
                    if losses > max_streak:
                        max_streak = losses
                        best_sequence = game_results[i:j + 1]
                    break
    
    return best_sequence

def damage_share(matches, puuid_set):
    total_player_damage = 0
    total_team_damage = 0
    teammate_damage_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        # Get team damage
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        team_damage = sum(p['totalDamageDealtToChampions'] for p in teammates)
        
        # Calculate individual teammate shares for this match
        for teammate in teammates:
            if teammate['puuid'].lower() not in puuid_set:  # Exclude the player
                teammate_share = (teammate['totalDamageDealtToChampions'] / team_damage) * 100 if team_damage > 0 else 0
                teammate_damage_shares.append(teammate_share)
        
        total_player_damage += player['totalDamageDealtToChampions']
        total_team_damage += team_damage
    
    player_share = round((total_player_damage / total_team_damage) * 100, 2) if total_team_damage > 0 else 0
    avg_teammate_share = round(sum(teammate_damage_shares) / len(teammate_damage_shares), 2) if teammate_damage_shares else 0
    
    return {
        'player_damage_share': player_share,
        'avg_teammate_damage_share': avg_teammate_share
    }


def gold_share(matches, puuid_set):
    total_player_gold = 0
    total_team_gold = 0
    teammate_gold_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        team_gold = sum(p['goldEarned'] for p in teammates)
        
        for teammate in teammates:
            if teammate['puuid'].lower() not in puuid_set:
                teammate_share = (teammate['goldEarned'] / team_gold) * 100 if team_gold > 0 else 0
                teammate_gold_shares.append(teammate_share)
        
        total_player_gold += player['goldEarned']
        total_team_gold += team_gold
    
    player_share = round((total_player_gold / total_team_gold) * 100, 2) if total_team_gold > 0 else 0
    avg_teammate_share = round(sum(teammate_gold_shares) / len(teammate_gold_shares), 2) if teammate_gold_shares else 0
    
    return {
        'player_gold_share': player_share,
        'avg_teammate_gold_share': avg_teammate_share
    }

def kill_participation(matches, puuid_set):
    total_player_kp = 0
    teammate_kp_shares = []
    total_games = 0
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        team_kills = sum(p['kills'] for p in teammates)
        
        if team_kills > 0:
            player_kp = ((player['kills'] + player['assists']) / team_kills) * 100
            total_player_kp += player_kp
            
            for teammate in teammates:
                if teammate['puuid'].lower() not in puuid_set:
                    teammate_kp = ((teammate['kills'] + teammate['assists']) / team_kills) * 100
                    teammate_kp_shares.append(teammate_kp)
            
            total_games += 1
    
    avg_player_kp = round(total_player_kp / total_games, 2) if total_games > 0 else 0
    avg_teammate_kp = round(sum(teammate_kp_shares) / len(teammate_kp_shares), 2) if teammate_kp_shares else 0
    
    return {
        'player_kill_participation': avg_player_kp,
        'avg_teammate_kill_participation': avg_teammate_kp
    }


def healing_share(matches, puuid_set):
    total_player_healing = 0
    total_team_healing = 0
    teammate_healing_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        team_healing = sum(p['totalHealsOnTeammates'] for p in teammates)
        
        for teammate in teammates:
            if teammate['puuid'].lower() not in puuid_set:
                teammate_share = (teammate['totalHealsOnTeammates'] / team_healing) * 100 if team_healing > 0 else 0
                teammate_healing_shares.append(teammate_share)
        
        total_player_healing += player['totalHealsOnTeammates']
        total_team_healing += team_healing
    
    player_share = round((total_player_healing / total_team_healing) * 100, 2) if total_team_healing > 0 else 0
    avg_teammate_share = round(sum(teammate_healing_shares) / len(teammate_healing_shares), 2) if teammate_healing_shares else 0
    
    return {
        'player_healing_share': player_share,
        'avg_teammate_healing_share': avg_teammate_share
    }

#######################
## MVP SPECIFIC METRICS ##
#######################

# 0.3 carry impact is a hard carry, -0.3 is a hard be carried
def damage_gini_coefficient(matches, puuid_set):
    def gini(values):
        if len(values) == 0 or sum(values) == 0:
            return 0
        sorted_values = sorted(values)
        n = len(sorted_values)
        cumsum = np.cumsum(sorted_values)
        return (n + 1 - 2 * sum(cumsum) / cumsum[-1]) / n
    
    with_player_ginis = []
    without_player_ginis = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        
        with_player_damage = [p['totalDamageDealtToChampions'] for p in teammates]
        with_player_ginis.append(gini(with_player_damage))
        
        without_player_damage = [p['totalDamageDealtToChampions'] for p in teammates 
                               if p['puuid'].lower() not in puuid_set]
        if len(without_player_damage) > 1:
            without_player_ginis.append(gini(without_player_damage))
    
    avg_with_player = round(np.mean(with_player_ginis), 3) if with_player_ginis else 0
    avg_without_player = round(np.mean(without_player_ginis), 3) if without_player_ginis else 0
    
    return {
        'gini_with_player': avg_with_player.mean().item(),
        'gini_without_player': avg_without_player.mean().item(),
        'carry_impact': round(avg_with_player - avg_without_player, 3).mean().item()
    }

def gold_gini_coefficient(matches, puuid_set):
    def gini(values):
        if len(values) == 0 or sum(values) == 0:
            return 0
        sorted_values = sorted(values)
        n = len(sorted_values)
        cumsum = np.cumsum(sorted_values)
        return (n + 1 - 2 * sum(cumsum) / cumsum[-1]) / n
    
    with_player_ginis = []
    without_player_ginis = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        
        # Gold values including player
        with_player_gold = [p['goldEarned'] for p in teammates]
        with_player_ginis.append(gini(with_player_gold))
        
        # Gold values excluding player
        without_player_gold = [p['goldEarned'] for p in teammates 
                              if p['puuid'].lower() not in puuid_set]
        if len(without_player_gold) > 1:
            without_player_ginis.append(gini(without_player_gold))
    
    avg_with_player = round(float(np.mean(with_player_ginis)), 3) if with_player_ginis else 0
    avg_without_player = round(float(np.mean(without_player_ginis)), 3) if without_player_ginis else 0
    
    return {
        'gini_with_player': avg_with_player,
        'gini_without_player': avg_without_player,
        'carry_impact': round(float(avg_with_player - avg_without_player), 3)
    }


def performance_comparison(matches, puuid_set):
    player_scores = []
    best_teammate_scores = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        teammates = [p for p in match['info']['participants'] if p['teamId'] == player['teamId']]
        
        # Calculate scores for all teammates
        teammate_scores = []
        for teammate in teammates:
            damages = [p['totalDamageDealtToChampions'] for p in teammates]
            golds = [p['goldEarned'] for p in teammates]
            kills = [p['kills'] for p in teammates]
            assists = [p['assists'] for p in teammates]
            deaths = [p['deaths'] for p in teammates]
            
            damage_rank = sorted(damages).index(teammate['totalDamageDealtToChampions']) + 1
            gold_rank = sorted(golds).index(teammate['goldEarned']) + 1
            kill_rank = sorted(kills).index(teammate['kills']) + 1
            assist_rank = sorted(assists).index(teammate['assists']) + 1
            death_rank = 6 - (sorted(deaths, reverse=True).index(teammate['deaths']) + 1)
            
            score = (damage_rank * 0.3 + gold_rank * 0.2 + kill_rank * 0.2 + 
                    assist_rank * 0.2 + death_rank * 0.1) / 5.0 * 100
            
            teammate_scores.append(score)
            
            if teammate['puuid'].lower() in puuid_set:
                player_scores.append(score)
        
        best_teammate_scores.append(max(teammate_scores))
    
    avg_player_score = round(float(np.mean(player_scores)), 1) if player_scores else 0
    avg_best_score = round(float(np.mean(best_teammate_scores)), 1) if best_teammate_scores else 0
    
    # Calculate percentile among all teammates across all games
    all_scores = []
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
        teammates = [p for p in match['info']['participants'] if p['teamId'] == match['info']['participants'][0]['teamId']]
        if len(teammates) == 5:
            all_scores.extend([20, 40, 60, 80, 100])  # Simplified: each player gets their rank percentile
    
    percentile = round(float(np.percentile(all_scores, avg_player_score)), 1) if all_scores else 0
    
    return {
        'player_performance_score_kda_gold_damage': avg_player_score,
        'best_teammate_score_kda_gold_damage': avg_best_score,
        'performance_percentile': percentile
    }

###############################################
## TEAM METRICS FOR OVERALL TEAM PERFORMANCE ##
###############################################

def objective_control_ratio(matches, puuid_set):
    player_team_objectives = 0
    enemy_team_objectives = 0
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        # Define objectives based on game mode
        if match['info']['gameMode'] == 'ARAM':
            objective_keys = ['inhibitorKills', 'turretKills']
        else:
            objective_keys = ['baronKills', 'dragonKills', 'inhibitorKills', 'turretKills']
        
        # Calculate team objectives (player's team)
        team_objectives = sum(
            sum(p[key] for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        enemy_objectives = sum(
            sum(p[key] for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        
        player_team_objectives += team_objectives
        enemy_team_objectives += enemy_objectives
    
    total_objectives = player_team_objectives + enemy_team_objectives
    
    player_ratio = round((player_team_objectives / total_objectives), 2) if total_objectives > 0 else 0
    enemy_ratio = round((enemy_team_objectives / total_objectives), 2) if total_objectives > 0 else 0
    
    return {
        'player_team_objective_ratio': player_ratio,
        'enemy_team_objective_ratio': enemy_ratio
    }


def ping_to_action_ratio(matches, puuid_set):
    player_team_pings = 0
    player_team_actions = 0
    enemy_team_pings = 0
    enemy_team_actions = 0
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        
        if not player:
            continue
        
        # Define objectives based on game mode
        if match['info']['gameMode'] == 'ARAM':
            objective_keys = ['inhibitorKills', 'turretKills']
        else:
            objective_keys = ['baronKills', 'dragonKills', 'inhibitorKills', 'turretKills']
        
        # Calculate for player's team
        team_pings = sum(
            p.get('allInPings', 0) * 2.0 +
            p.get('assistMePings', 0) * 1.5 +
            p.get('onMyWayPings', 0) * 1.0 +
            p.get('dangerPings', 0) * 1.5 +
            p.get('retreatPings', 0) * 1.2
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        team_kda = sum(
            (p['kills'] * 3.0 + p['assists'] * 2.0 - p['deaths'] * 1.0)
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        team_objectives = sum(
            sum(p.get(key, 0) * (5.0 if key in ['baronKills', 'dragonKills'] else 2.0) for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        
        player_team_pings += team_pings
        player_team_actions += team_kda + team_objectives
        
        # Calculate for enemy team
        enemy_pings = sum(
            p.get('allInPings', 0) * 2.0 +
            p.get('assistMePings', 0) * 1.5 +
            p.get('onMyWayPings', 0) * 1.0 +
            p.get('dangerPings', 0) * 1.5 +
            p.get('retreatPings', 0) * 1.2
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        enemy_kda = sum(
            (p['kills'] * 3.0 + p['assists'] * 2.0 - p['deaths'] * 1.0)
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        enemy_objectives = sum(
            sum(p.get(key, 0) * (5.0 if key in ['baronKills', 'dragonKills'] else 2.0) for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        
        enemy_team_pings += enemy_pings
        enemy_team_actions += enemy_kda + enemy_objectives
    
    
    player_ratio = round(player_team_pings / player_team_actions, 2) if player_team_actions > 0 else 0
    enemy_ratio = round(enemy_team_pings / enemy_team_actions, 2) if enemy_team_actions > 0 else 0
    
    return {
        'player_team_ping_to_action_ratio': player_ratio,
        'enemy_team_ping_to_action_ratio': enemy_ratio
    }


def vision_control_share(matches, puuid_set):
    player_team_shares = []
    enemy_team_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        if match['info']['gameMode'] == 'ARAM':
            continue
        
        team_vision = sum(p['visionScore'] for p in match['info']['participants'] if p['teamId'] == player['teamId'])
        enemy_vision = sum(p['visionScore'] for p in match['info']['participants'] if p['teamId'] != player['teamId'])
        
        total_vision = team_vision + enemy_vision
        
        if total_vision > 0:
            player_share = (team_vision / total_vision) * 100
            enemy_share = (enemy_vision / total_vision) * 100
            
            player_team_shares.append(player_share)
            enemy_team_shares.append(enemy_share)
    
    avg_player_share = round(sum(player_team_shares) / len(player_team_shares), 2) if player_team_shares else 0
    avg_enemy_share = round(sum(enemy_team_shares) / len(enemy_team_shares), 2) if enemy_team_shares else 0
    
    return {
        'player_team_vision_share': avg_player_share,
        'enemy_team_vision_share': avg_enemy_share
    }


def kill_participation_rate_assists_vs_kills(matches, puuid_set):
    player_team_kills = 0
    player_team_assists = 0
    enemy_team_kills = 0
    enemy_team_assists = 0
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        # Player team stats
        team_kills = sum(p['kills'] for p in match['info']['participants'] if p['teamId'] == player['teamId'])
        team_assists = sum(p['assists'] for p in match['info']['participants'] if p['teamId'] == player['teamId'])
        
        player_team_kills += team_kills
        player_team_assists += team_assists
        
        # Enemy team stats
        enemy_kills = sum(p['kills'] for p in match['info']['participants'] if p['teamId'] != player['teamId'])
        enemy_assists = sum(p['assists'] for p in match['info']['participants'] if p['teamId'] != player['teamId'])
        
        enemy_team_kills += enemy_kills
        enemy_team_assists += enemy_assists
    
    player_team_kp_rate = round((player_team_kills + player_team_assists) / max(1, player_team_kills), 2)
    enemy_team_kp_rate = round((enemy_team_kills + enemy_team_assists) / max(1, enemy_team_kills), 2)
    
    return {
        'player_team_kill_participation_rate': player_team_kp_rate,
        'enemy_team_kill_participation_rate': enemy_team_kp_rate
    }


def first_objective_score(matches, puuid_set):
    weights = {
        'champion': 1.0,
        'tower': 1.5,
        'inhibitor': 1.2,
        'baron': 1.5,
        'dragon': 1.2,
        'riftHerald': 1.0
    }
    
    player_team_score = 0
    enemy_team_score = 0
    total_games = 0
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        total_games += 1
        
        # Find player's team and enemy team objectives
        for team in match['info']['teams']:
            objectives = team['objectives']
            
            first_objectives = {
                'champion': objectives['champion']['first'],
                'tower': objectives['tower']['first'],
                'inhibitor': objectives['inhibitor']['first'],
                'baron': objectives['baron']['first'],
                'dragon': objectives['dragon']['first'],
                'riftHerald': objectives['riftHerald']['first']
            }
            
            match_score = sum(weights[k] * (1 if first_objectives[k] else 0) for k in weights)
            
            if team['teamId'] == player['teamId']:
                player_team_score += match_score
            else:
                enemy_team_score += match_score
    
    max_possible_score = sum(weights.values())
    
    player_ratio = round((player_team_score / (total_games * max_possible_score)), 2) if total_games > 0 else 0
    enemy_ratio = round((enemy_team_score / (total_games * max_possible_score)), 2) if total_games > 0 else 0
    
    return {
        'player_team_first_objective_ratio': player_ratio,
        'enemy_team_first_objective_ratio': enemy_ratio
    }


def objective_control_share(matches, puuid_set):
    player_team_shares = []
    enemy_team_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        # Define objectives based on game mode
        if match['info']['gameMode'] == 'ARAM':
            objective_keys = ['inhibitorKills', 'turretKills']
        else:
            objective_keys = ['baronKills', 'dragonKills', 'inhibitorKills', 'turretKills']
        
        team_objectives = sum(
            sum(p[key] for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        enemy_objectives = sum(
            sum(p[key] for key in objective_keys)
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        
        total_objectives = team_objectives + enemy_objectives
        
        if total_objectives > 0:
            player_share = (team_objectives / total_objectives) * 100
            enemy_share = (enemy_objectives / total_objectives) * 100
            
            player_team_shares.append(player_share)
            enemy_team_shares.append(enemy_share)
    
    avg_player_share = round(sum(player_team_shares) / len(player_team_shares), 2) if player_team_shares else 0
    avg_enemy_share = round(sum(enemy_team_shares) / len(enemy_team_shares), 2) if enemy_team_shares else 0
    
    return {
        'player_team_objective_share': avg_player_share,
        'enemy_team_objective_share': avg_enemy_share
    }


def minion_killed_share(matches, puuid_set):
    player_team_shares = []
    enemy_team_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        team_minions = sum(
            p['totalMinionsKilled'] + p['neutralMinionsKilled']
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        enemy_minions = sum(
            p['totalMinionsKilled'] + p['neutralMinionsKilled']
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        
        total_minions = team_minions + enemy_minions
        
        if total_minions > 0:
            player_share = (team_minions / total_minions) * 100
            enemy_share = (enemy_minions / total_minions) * 100
            
            player_team_shares.append(player_share)
            enemy_team_shares.append(enemy_share)
    
    avg_player_share = round(sum(player_team_shares) / len(player_team_shares), 2) if player_team_shares else 0
    avg_enemy_share = round(sum(enemy_team_shares) / len(enemy_team_shares), 2) if enemy_team_shares else 0
    
    return {
        'player_team_minion_share': avg_player_share,
        'enemy_team_minion_share': avg_enemy_share
    }

def structural_damage_share(matches, puuid_set):
    player_team_shares = []
    enemy_team_shares = []
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        team_structure_damage = sum(
            p['damageDealtToBuildings']
            for p in match['info']['participants'] if p['teamId'] == player['teamId']
        )
        enemy_structure_damage = sum(
            p['damageDealtToBuildings']
            for p in match['info']['participants'] if p['teamId'] != player['teamId']
        )
        
        total_structure_damage = team_structure_damage + enemy_structure_damage
        
        if total_structure_damage > 0:
            player_share = (team_structure_damage / total_structure_damage) * 100
            enemy_share = (enemy_structure_damage / total_structure_damage) * 100
            
            player_team_shares.append(player_share)
            enemy_team_shares.append(enemy_share)
    
    avg_player_share = round(sum(player_team_shares) / len(player_team_shares), 2) if player_team_shares else 0
    avg_enemy_share = round(sum(enemy_team_shares) / len(enemy_team_shares), 2) if enemy_team_shares else 0
    
    return {
        'player_team_structure_damage_share': avg_player_share,
        'enemy_team_structure_damage_share': avg_enemy_share
    }

def epic_monster_damage_share(matches, puuid_set):
    player_team_shares = []
    enemy_team_shares = []
    
    for match in matches:
        info = match.get('info', {})
        if info.get('gameDuration', 0) < 300 or not info.get('participants'):
            continue
        
        if info.get('gameMode') == 'ARAM':
            continue
        
        player = next(
            (p for p in info['participants'] if p['puuid'].lower() in puuid_set),
            None
        )
        if not player:
            continue
        
        # Approximate "epic monster" damage
        def epic_damage(p):
            return max(0, p.get('damageDealtToObjectives', 0) - p.get('damageDealtToTurrets', 0))
        
        team_epic_damage = sum(epic_damage(p) for p in info['participants'] if p['teamId'] == player['teamId'])
        enemy_epic_damage = sum(epic_damage(p) for p in info['participants'] if p['teamId'] != player['teamId'])
        total_epic_damage = team_epic_damage + enemy_epic_damage
        
        if total_epic_damage > 0:
            player_share = (team_epic_damage / total_epic_damage) * 100
            enemy_share = (enemy_epic_damage / total_epic_damage) * 100
            player_team_shares.append(player_share)
            enemy_team_shares.append(enemy_share)
    
    avg_player_share = round(sum(player_team_shares) / len(player_team_shares), 2) if player_team_shares else 0
    avg_enemy_share = round(sum(enemy_team_shares) / len(enemy_team_shares), 2) if enemy_team_shares else 0
    
    return {
        'player_team_epic_monster_share': avg_player_share,
        'enemy_team_epic_monster_share': avg_enemy_share
    }

def team_lane_dominance(matches, puuid_set):
    lane_stats = {
        'top': {'player_wins': 0, 'total_games': 0},
        'jungle': {'player_wins': 0, 'total_games': 0},
        'mid': {'player_wins': 0, 'total_games': 0},
        'bottom': {'player_wins': 0, 'total_games': 0},
        'support': {'player_wins': 0, 'total_games': 0}
    }
    
    lane_mapping = {
        'TOP': 'top',
        'JUNGLE': 'jungle', 
        'MIDDLE': 'mid',
        'BOTTOM': 'bottom',
        'UTILITY': 'support'
    }
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        if match['info']['gameMode'] != 'CLASSIC':
            continue
        
        # Check each lane matchup
        for api_lane, display_lane in lane_mapping.items():
            player_team_lane = next((p for p in match['info']['participants'] 
                                   if p['teamId'] == player['teamId'] and p['teamPosition'] == api_lane), None)
            enemy_team_lane = next((p for p in match['info']['participants'] 
                                  if p['teamId'] != player['teamId'] and p['teamPosition'] == api_lane), None)
            
            if player_team_lane and enemy_team_lane:
                lane_stats[display_lane]['total_games'] += 1
                
                # Compare team lane performance
                player_performance = player_team_lane['goldEarned'] + (player_team_lane['totalMinionsKilled'] * 20)
                enemy_performance = enemy_team_lane['goldEarned'] + (enemy_team_lane['totalMinionsKilled'] * 20)
                
                if player_performance > enemy_performance:
                    lane_stats[display_lane]['player_wins'] += 1

    dominance_results = {}
    for lane in lane_stats.keys():
        if lane_stats[lane]['total_games'] > 0:
            dominance_pct = round((lane_stats[lane]['player_wins'] / lane_stats[lane]['total_games']) * 100, 2)
        else:
            dominance_pct = 0
            
        dominance_results[f'{lane}_dominance'] = round(max(1,dominance_pct))
    
    return dominance_results


def game_mode_win_percentage(matches, puuid_set):
    aram_stats = {'wins': 0, 'total': 0}
    classic_stats = {'wins': 0, 'total': 0}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        if match['info']['gameMode'] == 'ARAM':
            aram_stats['total'] += 1
            if player['win']:
                aram_stats['wins'] += 1
        elif match['info']['gameMode'] == 'CLASSIC':
            classic_stats['total'] += 1
            if player['win']:
                classic_stats['wins'] += 1
    
    aram_win_pct = round((aram_stats['wins'] / aram_stats['total']) * 100, 0) if aram_stats['total'] > 0 else 1
    classic_win_pct = round((classic_stats['wins'] / classic_stats['total']) * 100, 0) if classic_stats['total'] > 0 else 1
    
    return {
        'aram_win_percentage': aram_win_pct,
        'classic_win_percentage': classic_win_pct
    }


##############################
##   Contribution Charts  ####
##############################

def games_played_heatmap(matches, puuid_set, year=2025):
    # Initialize all dates in year with 0
    data = {}
    start = datetime.date(year, 1, 1)
    end = datetime.date(year, 12, 31)
    
    current = start
    while current <= end:
        data[current.strftime('%Y-%m-%d')] = 0
        current += datetime.timedelta(days=1)
    
    # Count games per date
    for match in matches:
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        timestamp_ms = match['info']['gameStartTimestamp']
        dt = datetime.datetime.fromtimestamp(timestamp_ms / 1000)
        date_str = dt.strftime('%Y-%m-%d')
        
        if date_str in data:
            data[date_str] += 1
    
    return data


def win_percentage_heatmap(matches, puuid_set, year=2025):
    # Initialize all dates in year with 0
    data = {}
    start = datetime.date(year, 1, 1)
    end = datetime.date(year, 12, 31)
    
    current = start
    while current <= end:
        data[current.strftime('%Y-%m-%d')] = 0
        current += datetime.timedelta(days=1)
    
    # Count wins and total games per date
    daily_stats = {}
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
            
        timestamp_ms = match['info']['gameStartTimestamp']
        dt = datetime.datetime.fromtimestamp(timestamp_ms / 1000)
        date_str = dt.strftime('%Y-%m-%d')
        
        if date_str in data:
            if date_str not in daily_stats:
                daily_stats[date_str] = {'wins': 0, 'total': 0}
            
            daily_stats[date_str]['total'] += 1
            if player['win']:
                daily_stats[date_str]['wins'] += 1
    
    # Calculate win percentages
    for date_str, stats in daily_stats.items():
        data[date_str] = round((stats['wins'] / stats['total']) * 100, 0)
    
    return data


####################
## Champion Data ###
####################

def top_champion_stats(matches, puuid_set, champions):
    champion_stats = {}
    champion_lookup = {champ['id']: champ['name'] for champ in champions}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        champ_id = str(player['championId'])
        if champ_id not in champion_stats:
            champion_stats[champ_id] = {
                'damage': 0, 'vision': 0, 'gold': 0, 'wins': 0, 'games': 0,
                'kills': 0, 'deaths': 0, 'assists': 0, 'farmed': 0
            }
        
        stats = champion_stats[champ_id]
        stats['damage'] += player['totalDamageDealtToChampions']
        stats['vision'] += player['visionScore']
        stats['gold'] += player['goldEarned']
        stats['farmed'] += player['totalMinionsKilled'] + player['neutralMinionsKilled']
        stats['kills'] += player['kills']
        stats['deaths'] += player['deaths']
        stats['assists'] += player['assists']
        stats['games'] += 1
        if player['win']:
            stats['wins'] += 1
    
    # Find top champions for each metric
    top_damage = max(champion_stats.items(), key=lambda x: x[1]['damage'])[0] if champion_stats else None
    top_vision = max(champion_stats.items(), key=lambda x: x[1]['vision'])[0] if champion_stats else None
    top_gold = max(champion_stats.items(), key=lambda x: x[1]['gold'])[0] if champion_stats else None
    top_wins = max(champion_stats.items(), key=lambda x: x[1]['wins'])[0] if champion_stats else None
    top_farmed = max(champion_stats.items(), key=lambda x: x[1]['farmed'])[0] if champion_stats else None
    
    # Calculate KDA and find top
    top_kda = None
    best_kda = 0
    for champ_id, stats in champion_stats.items():
        kda = (stats['kills'] + stats['assists']) / max(1, stats['deaths'])
        if kda > best_kda:
            best_kda = kda
            top_kda = champ_id
    
    return {
        'top_damage_champion': champion_lookup.get(top_damage, 'Unknown') if top_damage else None,
        'top_vision_champion': champion_lookup.get(top_vision, 'Unknown') if top_vision else None,
        'top_gold_champion': champion_lookup.get(top_gold, 'Unknown') if top_gold else None,
        'top_wins_champion': champion_lookup.get(top_wins, 'Unknown') if top_wins else None,
        'top_kda_champion': champion_lookup.get(top_kda, 'Unknown') if top_kda else None,
        'top_farmed_champion': champion_lookup.get(top_farmed, 'Unknown') if top_farmed else None
    }


def top_team_champion_stats(matches, puuid_set, champions):
    champion_stats = {}
    champion_lookup = {champ['id']: champ['name'] for champ in champions}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        # Get teammates excluding the player
        teammates = [p for p in match['info']['participants'] 
                    if p['teamId'] == player['teamId'] and p['puuid'].lower() not in puuid_set]
        
        for teammate in teammates:
            champ_id = str(teammate['championId'])
            if champ_id not in champion_stats:
                champion_stats[champ_id] = {
                    'damage': 0, 'vision': 0, 'gold': 0, 'wins': 0, 'games': 0,
                    'kills': 0, 'deaths': 0, 'assists': 0, 'farmed': 0
                }
            
            stats = champion_stats[champ_id]
            stats['damage'] += teammate['totalDamageDealtToChampions']
            stats['vision'] += teammate['visionScore']
            stats['gold'] += teammate['goldEarned']
            stats['farmed'] += teammate['totalMinionsKilled'] + teammate['neutralMinionsKilled']
            stats['kills'] += teammate['kills']
            stats['deaths'] += teammate['deaths']
            stats['assists'] += teammate['assists']
            stats['games'] += 1
            if teammate['win']:
                stats['wins'] += 1
    
    # Find top champions for each metric
    top_damage = max(champion_stats.items(), key=lambda x: x[1]['damage'])[0] if champion_stats else None
    top_vision = max(champion_stats.items(), key=lambda x: x[1]['vision'])[0] if champion_stats else None
    top_gold = max(champion_stats.items(), key=lambda x: x[1]['gold'])[0] if champion_stats else None
    top_wins = max(champion_stats.items(), key=lambda x: x[1]['wins'])[0] if champion_stats else None
    top_farmed = max(champion_stats.items(), key=lambda x: x[1]['farmed'])[0] if champion_stats else None
    
    # Calculate KDA and find top
    top_kda = None
    best_kda = 0
    for champ_id, stats in champion_stats.items():
        kda = (stats['kills'] + stats['assists']) / max(1, stats['deaths'])
        if kda > best_kda:
            best_kda = kda
            top_kda = champ_id
    
    return {
        'top_team_damage_champion': champion_lookup.get(top_damage, 'Unknown') if top_damage else None,
        'top_team_vision_champion': champion_lookup.get(top_vision, 'Unknown') if top_vision else None,
        'top_team_gold_champion': champion_lookup.get(top_gold, 'Unknown') if top_gold else None,
        'top_team_wins_champion': champion_lookup.get(top_wins, 'Unknown') if top_wins else None,
        'top_team_kda_champion': champion_lookup.get(top_kda, 'Unknown') if top_kda else None,
        'top_team_farmed_champion': champion_lookup.get(top_farmed, 'Unknown') if top_farmed else None
    }


def top_banned_champions_vs_player(matches, puuid_set, champions):
    champion_lookup = {champ['id']: champ['name'] for champ in champions}
    ban_counts = {}
    total_games = 0
    
    for match in matches:
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player:
            continue
        
        total_games += 1
        
        # Get enemy team bans
        enemy_team = next((team for team in match['info']['teams'] if team['teamId'] != player['teamId']), None)
        if not enemy_team or 'bans' not in enemy_team:
            continue
        
        # Count banned champions
        for ban in enemy_team['bans']:
            if ban['championId'] != -1:  # -1 means no ban
                champ_id = str(ban['championId'])
                if champ_id not in ban_counts:
                    ban_counts[champ_id] = 0
                ban_counts[champ_id] += 1
    
    # Get top 5 most banned champions with percentages
    top_bans = sorted(ban_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    result = {}
    for champ_id, count in top_bans:
        champion_name = champion_lookup.get(champ_id, 'Unknown')
        percentage = round((count / total_games) * 100) if total_games > 0 else 0
        result[champion_name] = percentage
    
    return result


def estimated_champions_that_killed_player(matches, puuid_set, champions):
    champion_lookup = {champ['id']: champ['name'] for champ in champions}
    estimated_kills = {}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player or player['deaths'] == 0:
            continue
        
        # Get enemy team
        enemies = [p for p in match['info']['participants'] if p['teamId'] != player['teamId']]
        total_enemy_kills = sum(e['kills'] for e in enemies)
        
        if total_enemy_kills == 0:
            continue
        
        # Calculate weights based on enemy kill participation
        for enemy in enemies:
            champ_name = champion_lookup.get(str(enemy['championId']), 'Unknown')
            weight = enemy['kills'] / total_enemy_kills
            estimated_deaths = player['deaths'] * weight
            
            if champ_name not in estimated_kills:
                estimated_kills[champ_name] = 0
            estimated_kills[champ_name] += estimated_deaths
    
    # Get top 5 estimated killers
    top_killers = sorted(estimated_kills.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {champ: round(kills, 2) for champ, kills in top_killers}


def estimated_champions_that_killed_player(matches, puuid_set, champions):
    champion_lookup = {champ['id']: champ['name'] for champ in champions}
    estimated_kills = {}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set), None)
        if not player or player['deaths'] == 0:
            continue
        
        # Get enemy team
        enemies = [p for p in match['info']['participants'] if p['teamId'] != player['teamId']]
        total_enemy_kills = sum(e['kills'] for e in enemies)
        
        if total_enemy_kills == 0:
            continue
        
        # Calculate weights based on enemy kill participation
        for enemy in enemies:
            champ_name = champion_lookup.get(str(enemy['championId']), 'Unknown')
            weight = enemy['kills'] / total_enemy_kills
            estimated_deaths = player['deaths'] * weight
            
            if champ_name not in estimated_kills:
                estimated_kills[champ_name] = 0
            estimated_kills[champ_name] += estimated_deaths
    
    # Convert to proportions that sum to 100
    total_estimated = sum(estimated_kills.values())
    if total_estimated == 0:
        return {}
    
    # Get top 5 and normalize to 100%
    top_killers = sorted(estimated_kills.items(), key=lambda x: x[1], reverse=True)[:5]
    top_total = sum(kills for _, kills in top_killers)
    
    return {champ: round((kills / top_total) * 100) for champ, kills in top_killers}


## Imma use the mastery api in order to get this data a priori in the chonky function
def mastery_vs_performance(matches, puuid_set, top_champion_masteries):
    mastery_lookup = {mastery['championId']: mastery for mastery in top_champion_masteries}
    
    puuid_set_lower = {puuid.lower() for puuid in puuid_set}
    
    champion_performance = {}
    
    for match in matches:
        is_abort = (match['info']['gameDuration'] < 300 or match['info']['endOfGameResult'] != 'GameComplete')
        if is_abort:
            continue
            
        player = next((p for p in match['info']['participants'] if p['puuid'].lower() in puuid_set_lower), None)
        if not player:
            continue
        
        champ_id = player['championId']
        
        if champ_id not in mastery_lookup:
            continue
        
        mastery = mastery_lookup[champ_id]
        champ_name = mastery['championName']
        
        if champ_name not in champion_performance:
            champion_performance[champ_name] = {
                'games': 0, 'wins': 0, 'total_damage': 0, 'total_gold': 0, 'total_duration': 0,
                'total_kills': 0, 'total_deaths': 0, 'total_assists': 0,
                'mastery_level': mastery['championLevel'],
                'mastery_points': mastery['championPoints'],
                'story': mastery['championStory']
            }
        
        stats = champion_performance[champ_name]
        stats['games'] += 1
        if player['win']:
            stats['wins'] += 1
        stats['total_damage'] += player['totalDamageDealtToChampions']
        stats['total_gold'] += player['goldEarned']
        stats['total_duration'] += match['info']['gameDuration']
        stats['total_kills'] += player['kills']
        stats['total_deaths'] += player['deaths']
        stats['total_assists'] += player['assists']
    
    result = {}
    for champ_name, stats in sorted(champion_performance.items(), key=lambda x: x[1]['mastery_points'], reverse=True)[:5]:
        if stats['games'] > 0:
            total_minutes = stats['total_duration'] / 60
            result[champ_name] = {
                'mastery_level': stats['mastery_level'],
                'mastery_points': stats['mastery_points'],
                'story': stats['story'],
                'win_rate': round((stats['wins'] / stats['games']) * 100, 0),
                'damage_per_minute': round(stats['total_damage'] / total_minutes, 0),
                'gold_per_minute': round(stats['total_gold'] / total_minutes, 0),
                'kda_per_minute': round((stats['total_kills'] + stats['total_assists'] - stats['total_deaths']) / total_minutes, 0),
                'games_played': stats['games']
            }
    
    return result
