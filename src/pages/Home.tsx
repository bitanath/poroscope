import { useEffect, useState, useRef } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"
import Summary from "@/components/report/Summary";

//Data Fetching and function calling (kinda chonky but okay for now)
import { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

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
  const client = generateClient<Schema>()
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasRun = useRef(false);

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
          console.log("Starting to fetch game data",riotId,region!.toUpperCase())
          const response = await fetchGameData(riotId!,region!.toUpperCase(),session)
          console.log(response)
          const gameData = JSON.parse(response.body?.toString()||'{"error":"Fetched blank game data"}')
          console.log("Got game data",gameData)
          // if(!gameData || gameData.statusCode!=200 || !gameData.body || JSON.parse(gameData.body).error) throw "Unable to fetch game data"
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
      <Summary profileDetails={profile} signOut={signOut}></Summary>
      <VStack><Spacer size="20"></Spacer></VStack>
    </div>
  );
}
