interface Champion {
  name: string;
  title: string;
}

interface GameStats {
  played: number;
  win: number;
  loss: number;
  abort: number;
}

interface KDA {
  kills: number;
  deaths: number;
  assists: number;
}

interface HoursByLane {
  bottom: number;
  support: number;
  mid: number;
  other: number;
  top: number;
  jungle: number;
  most_common_lane: string;
}

interface RolePercentage {
  bottom: number;
  support: number;
  mid: number;
  top: number;
  jungle: number;
}

interface ChartEntry {
  datetime: string;
  status: string;
}

export interface ToplineData {
  hours_played: number;
  longest_streak_days: number;
  longest_win_streak: number;
  classic_games_stats: GameStats;
  aram_games_stats: GameStats;
  arena_games_stats: GameStats;
  kills_deaths_assists: KDA;
  avg_gold_earned_per_minute: number;
  avg_damage_dealt_per_minute: number;
  avg_gold_spent_per_minute: number;
  avg_damage_taken_per_minute: number;
  avg_damage_mitigated_per_minute: number;
  hours_by_lane: HoursByLane;
  role_percentage: RolePercentage;
}

export interface PlayerData {
  player_lane_dominance: {
    top_dominance: number;
    jungle_dominance: number;
    mid_dominance: number;
    bottom_dominance: number;
    support_dominance: number;
  };
  damage_share: {
    player_damage_share: number;
    avg_teammate_damage_share: number;
  };
  gold_share: {
    player_gold_share: number;
    avg_teammate_gold_share: number;
  };
  healing_share: {
    player_healing_share: number;
    avg_teammate_healing_share: number;
  };
  kill_participation: {
    player_kill_participation: number;
    avg_teammate_kill_participation: number;
  };
  damage_gini_coefficient: {
    gini_with_player: number;
    gini_without_player: number;
    carry_impact: number;
  };
  gold_gini_coefficient: {
    gini_with_player: number;
    gini_without_player: number;
    carry_impact: number;
  };
  performance_comparison: {
    player_performance_score_kda_gold_damage: number;
    best_teammate_score_kda_gold_damage: number;
    performance_percentile: number;
  };
}

export interface TeamData {
  objective_control_ratio: {
    player_team_objective_ratio: number;
    enemy_team_objective_ratio: number;
  };
  ping_to_action_ratio: {
    player_team_ping_to_action_ratio: number;
    enemy_team_ping_to_action_ratio: number;
  };
  vision_control_share: {
    player_team_vision_share: number;
    enemy_team_vision_share: number;
  };
  kill_participation_rate_assists_vs_kills: {
    player_team_kill_participation_rate: number;
    enemy_team_kill_participation_rate: number;
  };
  first_objective_score: {
    player_team_first_objective_ratio: number;
    enemy_team_first_objective_ratio: number;
  };
  minion_killed_share: {
    player_team_minion_share: number;
    enemy_team_minion_share: number;
  };
  epic_monster_damage_share: {
    player_team_epic_monster_share: number;
    enemy_team_epic_monster_share: number;
  };
  objective_control_share: {
    player_team_objective_share: number;
    enemy_team_objective_share: number;
  };
}

export interface ChartData {
  hot_streak: ChartEntry[];
  tilt_chart: ChartEntry[];
  games_played_heatmap: Record<string, number>;
  win_percentage_heatmap: Record<string, number>;
  game_mode_win_percentage: {
    aram_win_percentage: number;
    classic_win_percentage: number;
  };
  team_lane_dominance: {
    top_dominance: number;
    jungle_dominance: number;
    mid_dominance: number;
    bottom_dominance: number;
    support_dominance: number;
  };
  player_lane_dominance: {
    top_dominance: number;
    jungle_dominance: number;
    mid_dominance: number;
    bottom_dominance: number;
    support_dominance: number;
  };
}

export interface ChampionData {
  insight_champion: string;
  insight_nemesis: string;
  insight_banned: string;
  champions: Champion[];
  nemesis: Champion[];
  banned: Champion[];
}

export interface ChampionMastery {
  insight_mastery: string;
  mastery: Champion[];
}

export interface ToplineInsights {
  insight_topline: string;
  metric_topline: string;
}

export interface PlayerInsights {
  insight_player: string;
  metric_player: string;
}

export interface TeamInsights {
  insight_team: string;
  metric_team: string;
}
