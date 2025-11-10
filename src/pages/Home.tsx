import { useEffect, useState, useRef } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"
import Summary from "@/components/report/Summary";
import { Dock } from "@/components/sections/Dock";

//Data Fetching and function calling (kinda chonky but okay for now)
import { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { ChampionData, ChampionMastery, ChartData, PlayerData, PlayerInsights, TeamData, TeamInsights, ToplineData, ToplineInsights } from "@/components/report/types";

const loadingStates = [ { text: "Fetching Summoner Profile", }, { text: "Fetching Matches", }, { text: "Understanding Match Data", }, { text: "Understanding Champion Statistics", }, { text: "Identifying Competitive Insights", }, { text: "Preparing Report", }, { text: "Ready to Go!", }]

interface HomeProps {
  signOut: () => void;
  user: any;
}

const fetchUser = async ()=>{
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.payload;
    const riotId = token?.['preferred_username']?.toString()
    const region = token?.['zoneinfo']?.toString()
    const email = token?.['email']?.toString()
    return {riotId,region,email,session}
}

const fetchProfilePic = async (fullName:string,region:string)=>{
  const client = generateClient<Schema>({authMode: 'userPool'})
  const profile = await client.queries.summonerFetcher({
      fullName: fullName,
      region: region
  })
  return profile
}

const fetchGameData = async (fullName: string, region: string, session: any) => {
  const client = new LambdaClient({ region: 'us-east-1',credentials: session.credentials });
  const command = new InvokeCommand({
    FunctionName: 'amplify-d17o49q02hg78d-main-b-orchestratorDDCE86FA-h6z54lCpyUFr', // Your function name
    Payload: JSON.stringify({
      arguments: {
        name: fullName,
        region: region
      }
    })
  });
  
  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  
  return result;
};

export default function Home({ signOut }: HomeProps) {
  const [profile, setProfile] = useState<Record<string,any>|null>(null)
  const [dockVisible,setDockVisible] = useState(false);
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

  useEffect(()=>{
    if (hasRun.current) return;
    hasRun.current = true;
    const getData = async () => {
        try{
          const {riotId, region, session} = await fetchUser()
          if(!riotId) throw "Riot ID absent from database"
          const profile = await fetchProfilePic(riotId,region!.toUpperCase())
          
          const profileData = JSON.parse(profile.data?.toString()||"{}")
          const profileDetails = JSON.parse(profileData.body.toString()||"{}")
          if(!profileDetails || !profileDetails.profile_icon_url) throw "Unable to fetch profile"
          setProfile(profileDetails)
          
          const response = await fetchGameData(riotId!,region!.toUpperCase(),session)
          const gameData = JSON.parse(response.body?.toString()||'{"error":"Fetched blank game data"}')
          
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
          console.log("ERROR: ",e)
        }
      }
      getData()
  },[]) //XXX: Always set this so that the fetcher runs only once lol
  return (
    <div className="w-screen h-screen">
      
      <Loading 
        loadingStates={loadingStates}
        loading={loading}
        error={error}
        setLoading={setLoading}
      />
      {!loading && <Summary 
              setDockVisible={setDockVisible}
              sharedReport={false}
              profileDetails={profile} 
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
      <VStack><Spacer size="20"></Spacer></VStack>
      <Dock visible={dockVisible} signOut={signOut}/>
    </div>
  );
}
