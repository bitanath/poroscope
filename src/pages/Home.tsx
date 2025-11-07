import { useState } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"

import Sticky from "@/components/sections/Sticky";

const loadingStates = [ { text: "Fetching Summoner Profile", }, { text: "Fetching Matches", }, { text: "Understanding Match Data", }, { text: "Understanding Champion Statistics", }, { text: "Identifying Competitive Insights", }, { text: "Preparing Report", }, { text: "Ready to Go!", }]

interface HomeProps {
  signOut: () => void;
}

export default function Home({ signOut }: HomeProps) {
  const [loading, setLoading] = useState(true);
  return (
    <div className="w-screen h-screen">
      <Loading 
        loadingStates={loadingStates}
        loading={loading}
        onStart={() => setLoading(true)}
        onStop={() => setLoading(false)}
      />
      <Sticky signOut={signOut}></Sticky>
      <VStack><Spacer size="20"></Spacer></VStack>
    </div>
  );
}
