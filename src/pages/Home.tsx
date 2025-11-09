import { useEffect, useState } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"
import Summary from "@/components/report/Summary";

//Data Fetching and function calling (kinda chonky but okay for now)
import { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

const loadingStates = [ { text: "Fetching Summoner Profile", }, { text: "Fetching Matches", }, { text: "Understanding Match Data", }, { text: "Understanding Champion Statistics", }, { text: "Identifying Competitive Insights", }, { text: "Preparing Report", }, { text: "Ready to Go!", }]

const fetchUser = async ()=>{
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.payload;
    console.log(session,token)
    const riotId = token?.['preferred_username']?.toString()
    const region = token?.['zoneinfo']?.toString()
    const email = token?.['email']?.toString()
    return {riotId,region,email}
}

const fetchProfilePic = async (fullName:string,region:string)=>{
  const client = generateClient<Schema>()
  const profile = await client.queries.summonerFetcher({
      fullName: fullName,
      region: region
  })
  return profile
}

const fetchGameData = async (fullName:string,region:string) =>{
  const client = generateClient<Schema>()
  const data = await client.queries.orchestrator({
    name: fullName,
    region: region
  })
  return data
}

interface HomeProps {
  signOut: () => void;
  user: any;
}

export default function Home({ signOut }: HomeProps) {
  const [profile, setProfile] = useState<Record<string,any>|null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(()=>{
  const getData = async () => {
      try{
        const {riotId, region} = await fetchUser()
        console.log("Got riot id",riotId)
        if(!riotId){
          console.log("RIOT ID absent")
          setError(true)
          return
        }
        const profile = await fetchProfilePic(riotId,region!.toUpperCase())
        console.log("Got profile",profile)
        const profileData = JSON.parse(profile.data?.toString()||"{}")
        const profileDetails = JSON.parse(profileData.body.toString()||"{}")
        setProfile(profileDetails)
        console.log(region,riotId)
        const response = await fetchGameData("MadSkilzz#NA1",region!.toUpperCase())
        const gameData = JSON.parse(response.data?.toString()||"{}")
        console.log("Got game data",gameData)
      }catch(e){
        setError(true)
        console.log(e)
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
