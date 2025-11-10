import { useParams, useSearchParams } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from 'amplify/data/resource';
import Summary from '@/components/report/Summary';
import { Loader, Message } from '@aws-amplify/ui-react';

import { ChampionData, ChampionMastery, ChartData, PlayerData, PlayerInsights, TeamData, TeamInsights, ToplineData, ToplineInsights } from "@/components/report/types";
import { VStack } from '@/components/sections/Stacks';

export default function Generated(){
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [hash,setHash] = useState("")

  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [_,setDockVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasRun = useRef(false);
  //TODO: all metrics and insights go here
  const [topline, setTopline] = useState<ToplineData|null>(null)
  const [topInsight, setTopInsight] = useState<ToplineInsights|null>(null)
  const [chartData, setChartData] = useState<ChartData|null>(null)
  const [playerData, setPlayerData] = useState<PlayerData|null>(null)
  const [playerInsight,setPlayerInsight] = useState<PlayerInsights|null>(null)
  const [championMastery,setChampionMastery] = useState<ChampionMastery|null>(null)
  const [championData,setChampionData] = useState<ChampionData|null>(null)
  const [teamInsight,setTeamInsight] = useState<TeamInsights|null>(null)
  const [teamData,setTeamData] = useState<TeamData|null>(null)

  const fetchGameData = async (cacheIdentifier: string, publicize=false) => {
    const client = generateClient<Schema>()
    const result = await client.queries.publicFetcher({
        cacheKey: cacheIdentifier,
        publicize: publicize
    })
    
    return result;
  };
  
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const showCopyLink = async () => {
      try{
          setLoading(true)
          const session = await fetchAuthSession()
          let farmHash = id
          let publicize = false
          if(session && id=="share"){
            const token = session.tokens?.idToken?.payload;
            const detail = `${token?.['preferred_username']}-${token?.['zoneinfo']}`
            const hash = btoa(detail)
            setHash(hash)
            setShowModal(true)
            farmHash = hash
            publicize = true
          }

          const response = await fetchGameData(farmHash!,publicize)
          const {body} = JSON.parse(response.data?.toString() ||'{"error":"Fetched blank game data"}')
          const gameData = JSON.parse(body)
          if(!gameData || gameData.error) throw "Unable to fetch game data"
          setTopline(gameData.topline_data)
          setTopInsight(gameData.topline_insights)
          setChartData(gameData.chart_data)
          setPlayerData(gameData.player_data)
          setPlayerInsight(gameData.player_insights)
          setChampionMastery(gameData.champion_mastery)
          setChampionData(gameData.champion_data)
          setTeamData(gameData.team_data)
          setTeamInsight(gameData.team_insights)

          setLoading(false)
      }catch(e){
        setError(true)
        setLoading(false)
      }
      
    }

    showCopyLink()
    
  }, [id, searchParams]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href.replace("/share",`/${hash}`));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="w-screen h-screen">
      {!loading && !error && <Summary 
                    setDockVisible={setDockVisible}
                    sharedReport={true}
                    topline={topline} 
                    topInsight={topInsight}
                    chartData={chartData}
                    playerData={playerData}
                    playerInsight={playerInsight}
                    championMastery={championMastery}
                    championData={championData}
                    teamData={teamData}
                    teamInsight={teamInsight}
            ></Summary>}
      {!loading && error && <Message
        variation="filled"
        colorTheme="error"
        heading="Unable to load generated poroscope">
        The account might not have made it public
      </Message>}
      {loading && !error && 
        <VStack className='w-screen h-screen flex items-center justify-center' style={{height: '100vh'}} justifyContent={"center"} alignItems={"center"}>
          <Loader size='large' />
        </VStack>
      }
      {showModal && !loading && !error && (
        <div className="fixed left-1/3 top-1/3 bg-transparent max-h-sm max-w-md w-full flex items-center justify-center z-500">
          <div className="bg-white z-100 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
            <h3 className="text-lg font-semibold mb-4">Share Link</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={window.location.href.replace("/share",`/${hash}`)} 
                readOnly 
                className="flex-1 p-2 border rounded bg-gray-50"
              />
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full p-2 border rounded hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
