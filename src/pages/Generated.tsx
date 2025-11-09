import { useParams, useSearchParams } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState, useRef } from 'react';
import { LambdaClient,InvokeCommand } from '@aws-sdk/client-lambda';
import Summary from '@/components/report/Summary';
import { Button } from '@aws-amplify/ui-react';

import { ChampionData, ChampionMastery, ChartData, PlayerData, PlayerInsights, TeamData, TeamInsights, ToplineData, ToplineInsights } from "@/components/report/types";

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

  const fetchGameData = async (cacheIdentifier: string, session: any, publicize=false) => {
    const client = new LambdaClient({ region: 'us-east-1',credentials: session.credentials });
    const command = new InvokeCommand({
      FunctionName: 'amplify-d17o49q02hg78d-main-b-orchestratorDDCE86FA-h6z54lCpyUFr', // Your function name
      Payload: JSON.stringify({
        arguments: {
          cacheKey: cacheIdentifier,
          publicize: publicize
        }
      })
    });
    
    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    
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

          const response = await fetchGameData(farmHash!,session,publicize)
          const gameData = JSON.parse(response.body?.toString()||'{"error":"Fetched blank game data"}')
          console.log("Got result",gameData,gameData.statusCode,gameData.body)
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

          console.log(session,id)
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
    <div>
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
      {!loading && error && <Button isLoading={loading} loadingText="Loading..." variation="destructive">
        Loading Report
      </Button>}
      {loading && !error && <Button isLoading={loading} loadingText="Loading..." variation="primary">
        Loading Report
      </Button>}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
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
