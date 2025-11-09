'use client';
import { ChampionData, ChampionMastery, ChartData, PlayerData, PlayerInsights, TeamData, TeamInsights, ToplineData, ToplineInsights } from './types';

import { ReactLenis,useLenis } from '@studio-freight/react-lenis';
import { useRef, useState } from 'react';
import { LightBoard } from '../ui/lightboard';

import Background from '../sections/Background';

import { Card } from '../sections/Champion';
import { Image } from '@aws-amplify/ui-react';
import TextAnimation from '@/components/ui/scroll-text';
import HorizontalScroller from '../sections/Horizontal';
import StatsCard from '../ui/stats-card';
import ChartCard  from '../ui/chart-card';

interface SummaryProps {
  setDockVisible: (visible:boolean) => void;
  sharedReport: boolean;
  profileDetails?: Record<string,any>|null
  topline?: ToplineData|null
  topInsight?: ToplineInsights|null
  chartData?: ChartData|null
  playerData?: PlayerData | null
  playerInsight?: PlayerInsights | null
  championMastery?: ChampionMastery | null
  championData?: ChampionData | null
  teamInsight?: TeamInsights | null
  teamData?: TeamData | null
}


export default function Summary({setDockVisible,sharedReport,profileDetails,topline,topInsight,chartData,playerData,playerInsight,championMastery,championData,teamInsight,teamData}:SummaryProps): JSX.Element {
  const container = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  const floor = (a:number|undefined|null)=>{
    if(!a){
      return 0
    }
    return Math.floor(a)
  }
  
  useLenis(lenis=>{
    setDockVisible(lenis.progress > 0.1)
  })

  return (
    <ReactLenis root>
      <main className='bg-white' ref={container}>
        <div className='wrapper group'>
          <section className='text-white h-screen w-full bg-slate-950 grid place-content-center relative top-0'>
            <div className="absolute inset-0 z-0">
              <Background opacity={0.24}/>
            </div>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10'></div>
            
              <div className="relative z-20">
                <div className="flex justify-center">
                  <div className="w-32 h-32 md:w-24 md:h-24 lg:w-20 lg:h-20" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}>
                    <Image 
                    src={profileDetails?.profile_icon_url}
                    hidden={!(profileDetails && profileDetails?.profile_icon_url)}
                    alt='Profile Image'
                    className="w-full h-full object-cover"
                    />
                </div>
              </div>
              <h1 className='1xl:text-xl text-3xl px-8 font-semibold text-center tracking-tight leading-[120%] mb-2'>Welcome Summoner!</h1>
              <TextAnimation
                as='p'
                letterAnime={true}
                text={`In 2025 you spent ${topline?.hours_played} hours of your year playing ${topline?.classic_games_stats.played} Summoner's Rift games and ${topline?.aram_games_stats.played} ARAM games ✨`}
                classname='max-w-screen text-white 2xl:text-7xl text-6xl px-8 font-semibold text-center tracking-tight leading-[120%]'
                variants={{
                    hidden: { filter: 'blur(4px)', opacity: 0, y: 20 },
                    visible: {
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.2,
                    },
                    },
                }}
                />
              {!sharedReport && <h1 className='dock-trigger xl:text-xl text-2xl px-8 font-semibold text-center tracking-tight leading-[120%] mt-20'>{profileDetails?.name}, This is your Rift Rewind 👇</h1>}
              {sharedReport && <h1 className='dock-trigger xl:text-xl text-2xl px-8 font-semibold text-center tracking-tight leading-[120%] mt-20'>Welcome to this shared Rift Rewind 👇</h1>}
            </div>
          </section>
          
          <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                <div className="absolute top-0 left-0 right-0 max-w-full w-full bg-black lightboard">
                    <LightBoard rows={25} lightSize={3} gap={2} text={`DPM:${floor(topline?.avg_damage_dealt_per_minute)}  GSPM:${floor(topline?.avg_gold_spent_per_minute)}  GPM:${floor(topline?.avg_gold_earned_per_minute)} DMPM:${floor(topline?.avg_damage_mitigated_per_minute)}`} font="default" updateInterval={200} colors={{ background: "#1a1a1a", textDim: "#00ffff", drawLine: "#0000ff", textBright: "#9e85bf", }} />
                </div>
                <TextAnimation
                    text={`It's been a good year! ${topInsight?.insight_topline}`}
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-7xl text-6xl max-w-screen mx-auto font-medium capitalize p-16'
                  />
                <div className="absolute bottom-0 left-0 right-0 max-w-full w-full bg-black lightboard">
                    <LightBoard rows={25} lightSize={3} gap={2} text={`Kills:${floor(topline?.kills_deaths_assists.kills)}  Deaths:${floor(topline?.kills_deaths_assists.deaths)}  Assists:${floor(topline?.kills_deaths_assists.assists)}`} font="default" updateInterval={200} colors={{ background: "#1a1a1a", textDim: "#00ffff", drawLine: "#0000ff", textBright: "#9e85bf", }} />
                </div>
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
            
        </div>

        <div className="wrapper">
            <HorizontalScroller>
                  <ChartCard variant='contribution-map' title='Games Played over The Year' data={chartData!.games_played_heatmap} footer="Heatmap of playing frequency (All Game Modes)"></ChartCard>

                  <ChartCard variant='category-split' title='Win Percentage by Game Mode' data={Object.values(chartData!.game_mode_win_percentage)} labels={Object.keys(chartData!.game_mode_win_percentage).map(a=>a.replace("_win_percentage",""))} footer={`${chartData!.game_mode_win_percentage.aram_win_percentage}% ARAM vs ${chartData!.game_mode_win_percentage.classic_win_percentage}% Classic games won`}></ChartCard>

                  <ChartCard variant='contribution-map' title='Win Percentage over The Year' data={chartData!.win_percentage_heatmap} label='%' footer="Heatmap of win percentage (All Game Modes)"></ChartCard>

                  <ChartCard variant='category-bar' title='Player Lane Dominance' data={Object.values(chartData!.player_lane_dominance)} labels={Object.keys(chartData!.player_lane_dominance).map(a=>a.replace("_dominance",""))} label={Object.entries(chartData!.player_lane_dominance).reduce((a, b) => a[1] > b[1] ? a : b)[0]} footer="Lane Dominance (All Game Modes)"></ChartCard>

                  <StatsCard title="Damage Share - Player Versus Team" value={playerData!.gold_share.player_gold_share.toFixed(1)} delta={playerData!.gold_share.player_gold_share - playerData!.gold_share.avg_teammate_gold_share} average={playerData!.gold_share.avg_teammate_gold_share.toFixed(1)} footer='Avg. Teammate Gold Share' variant="light" />

                  <StatsCard title="Gold Share - Player Versus Team" value={playerData!.damage_share.player_damage_share.toFixed(1)} delta={playerData!.damage_share.player_damage_share - playerData!.damage_share.avg_teammate_damage_share} average={playerData!.damage_share.avg_teammate_damage_share.toFixed(1)} footer='Avg. Teammate Healing Share' variant="purple" />

                  <StatsCard title="Healing Share - Player Versus Team" value={playerData!.healing_share.player_healing_share.toFixed(1)} delta={playerData!.healing_share.player_healing_share - playerData!.healing_share.avg_teammate_healing_share} average={playerData!.healing_share.avg_teammate_healing_share.toFixed(1)} footer='Avg. Teammate Healing Share' variant="teal" />

                  <ChartCard variant='formbar' title={`Hot Streak - ${chartData!.hot_streak.filter(a=>a.status=="win").length} games won in a row 🎉`} data={chartData!.hot_streak.map(({status: type, datetime: name, ...rest}) => ({type, name, ...rest}))} footer='A continuous winning streak exhibiting great form'></ChartCard>

                  <StatsCard title={`Performance Comparison vs Best Teammate - ${playerData?.performance_comparison.performance_percentile}th percentile`} value={playerData!.performance_comparison.player_performance_score_kda_gold_damage.toFixed(1)} delta={playerData!.performance_comparison.player_performance_score_kda_gold_damage - playerData!.performance_comparison.best_teammate_score_kda_gold_damage} average={playerData!.performance_comparison.best_teammate_score_kda_gold_damage.toFixed(1)} variant="purple" footer='KDA+Damage+Gold Weighted across games for top percentile'/>

                  <ChartCard variant='formbar' title={`Tilt Chart - ${chartData!.tilt_chart.filter(a=>a.status=="loss").length} games tilted in a row 😡`} data={chartData!.tilt_chart.map(({status: type, datetime: name, ...rest}) => ({type, name, ...rest}))} footer='A continuous losing streak irrespective of game mode'></ChartCard>
            </HorizontalScroller>
        </div>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                
                    <TextAnimation
                    text={playerInsight?.insight_player+" But we haven't even started on your champions yet."}
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-xl mx-auto font-medium capitalize'
                    />
                
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>

        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              {championMastery?.mastery.slice(0,5).map((item, index) => (
                <div className="wrapper">
                <Card 
                  key={item.name+"-"+item.title+"-"+index.toString()} 
                  name={item.name} 
                  stat={item.title}
                  index={index} 
                  activeIndex={activeCardIndex} 
                  setActiveIndex={setActiveCardIndex} 
                />
                <div className='h-screen'></div>
                </div>
              ))}
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-24 md:pl-16 font-bold text-right tracking-tight leading-[120%]'>
                Your Champion Mastery
              </h1>
              <br/>
              <h1 className='text-md md:text-4xl pl-24 md:pl-16 font-medium text-right tracking-tight leading-[120%]'>
                {championMastery?.insight_mastery} 👑
              </h1>
            </div>
          </div>
        </section>

        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                
                    <TextAnimation
                    text="But it hasn't always been smooth sailing."
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-md mx-auto font-medium capitalize'
                    />
                
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              {championData?.nemesis.slice(0,5).map((item, index) => (
                <div className="wrapper">
                <Card 
                  key={item.name+"-"+item.title+"-"+index.toString()} 
                  name={item.name} 
                  stat={item.title}
                  index={index} 
                  activeIndex={activeCardIndex} 
                  setActiveIndex={setActiveCardIndex} 
                />
                <div className='h-screen'></div>
                </div>
              ))}
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-24 md:pl-16 font-bold text-right tracking-tight leading-[120%]'>
                Champions that were your Nemesis
              </h1>
              <br/>
              <h1 className='text-md md:text-4xl pl-24 md:pl-16 font-medium text-right tracking-tight leading-[120%]'>
                These champions unalived you the most. Compared and normalized against your opponents and teammates. 💀
              </h1>
            </div>
          </div>
        </section>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                    <TextAnimation
                    text={teamInsight!.insight_team}
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-md mx-auto font-medium capitalize'
                    />
            </section>
            <div className='h-[200vh] bg-gray-300 text-black grid place-content-center'></div>
        </div>
        <div className="wrapper">
            <HorizontalScroller>

                  <ChartCard variant='category-bar' title='Team Lane Dominance' data={Object.values(chartData!.team_lane_dominance)} labels={Object.keys(chartData!.team_lane_dominance).map(a=>a.replace("_dominance",""))} label={Object.entries(chartData!.team_lane_dominance).reduce((a, b) => a[1] > b[1] ? a : b)[0]} footer="Lane Dominance (All Game Modes)"></ChartCard>

                  <StatsCard title="Objective Control Share - Team versus Enemy" value={teamData!.objective_control_share.player_team_objective_share.toFixed(1)} delta={teamData!.objective_control_share.player_team_objective_share - teamData!.objective_control_share.enemy_team_objective_share} average={teamData!.objective_control_share.enemy_team_objective_share.toFixed(1)} footer='Enemy Objective Control Share' variant="purple" />

                  <StatsCard title="Vision Control Share - Team versus Enemy" value={teamData!.vision_control_share.player_team_vision_share.toFixed(1)} delta={teamData!.vision_control_share.player_team_vision_share - teamData!.vision_control_share.enemy_team_vision_share} average={teamData!.vision_control_share.enemy_team_vision_share.toFixed(1)} footer='Enemy Vision Control Share' variant="teal" />

                  <StatsCard title="Ping to Action Ratio" value={teamData!.ping_to_action_ratio.player_team_ping_to_action_ratio.toFixed(1)} delta={teamData!.ping_to_action_ratio.player_team_ping_to_action_ratio - teamData!.ping_to_action_ratio.enemy_team_ping_to_action_ratio} average={teamData!.ping_to_action_ratio.enemy_team_ping_to_action_ratio.toFixed(1)} footer='Enemy Ping to Action ratio' variant="purple" />

                  <StatsCard title="Gini Coefficient - Damage" value={playerData!.damage_gini_coefficient.gini_with_player.toFixed(2)} delta={playerData!.damage_gini_coefficient.gini_with_player - playerData!.damage_gini_coefficient.gini_without_player} average={playerData!.damage_gini_coefficient.gini_without_player.toFixed(2)} footer='Gini Coefficient (measure of carry) with against without player' variant="teal" />

                  <StatsCard title="Gini Coefficient - Gold" value={playerData!.gold_gini_coefficient.gini_with_player.toFixed(2)} delta={playerData!.gold_gini_coefficient.gini_with_player - playerData!.gold_gini_coefficient.gini_without_player} average={playerData!.gold_gini_coefficient.gini_without_player.toFixed(2)} footer='Gini Coefficient (measure of carry) with against without player' variant="light" />

                  <StatsCard title="Kill Participation Rate" value={teamData!.kill_participation_rate_assists_vs_kills.player_team_kill_participation_rate.toFixed(1)} delta={teamData!.kill_participation_rate_assists_vs_kills.player_team_kill_participation_rate - teamData!.kill_participation_rate_assists_vs_kills.player_team_kill_participation_rate} average={teamData!.kill_participation_rate_assists_vs_kills.player_team_kill_participation_rate.toFixed(1)} footer='Enemy Team Kill Participation Rate (a measure of assists to kill and team unity)' variant="blue" />
            </HorizontalScroller>
        </div>
        <section className='text-white w-full bg-slate-950 sticky'>
          <div className='grid grid-cols-2 px-8'>
            <div className='grid gap-2'>
              {championData?.banned.slice(0,5).map((item, index) => (
                <div className="wrapper">
                <Card 
                  key={item.name+"-"+item.title+"-"+index.toString()} 
                  name={item.name} 
                  stat={item.title}
                  index={index} 
                  activeIndex={activeCardIndex} 
                  setActiveIndex={setActiveCardIndex} 
                />
                <div className='h-screen'></div>
                </div>
              ))}
            </div>
            <div className='sticky top-0 h-screen grid place-content-center'>
              <h1 className='text-xl md:text-4xl pl-24 md:pl-16 font-bold text-right tracking-tight leading-[120%]'>
                Champions that your team banned
              </h1>
              <h1 className='text-md md:text-4xl pl-24 md:pl-16 font-medium text-right tracking-tight leading-[120%]'>
                And finally, these were the champions your team banned for the highest number of games. 🥹
              </h1>
            </div>
          </div>
        </section>
        <div className='h-[50vh] bg-slate-950 text-black grid place-content-center sticky'></div>
        <div className='wrapper'>
            <section className='bg-gray-300 text-black grid place-content-center text-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden'>
                <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
                <Image src="/octocat.svg" maxWidth={120} maxHeight={120} alt="Fork us on Github" className='w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-20' style={{ transform: 'translateX(-50%)', marginLeft: '50%' }}></Image>
                    <TextAnimation
                    text={sharedReport ? "❤️ for Scrolling. Now to view your poroscope!" : "❤️ for Scrolling. Share your Poroscope -or- Check the source on Github 👇"}
                    variants={{
                        hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
                        visible: {
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                        transition: { ease: 'linear' },
                        },
                    }}
                    classname='xl:text-5xl text-4xl max-w-3/4 p-8 mx-auto font-medium capitalize'
                    />
            </section>
            
        </div>
        <footer className='group bg-slate-950'>
          <h1 className='text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-linear-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
          </h1>
        </footer>
      </main>
    </ReactLenis>
  );
}


