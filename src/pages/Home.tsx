import { useState } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"

import Summary from "@/components/report/Summary";

const loadingStates = [ { text: "Fetching Summoner Profile", }, { text: "Fetching Matches", }, { text: "Understanding Match Data", }, { text: "Understanding Champion Statistics", }, { text: "Identifying Competitive Insights", }, { text: "Preparing Report", }, { text: "Ready to Go!", }]

interface HomeProps {
  signOut: () => void;
  user: any;
}

export default function Home({ signOut }: HomeProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-screen h-screen">
      <Loading 
        loadingStates={loadingStates}
        loading={loading}
        setLoading={setLoading}
      />
      <Summary signOut={signOut}></Summary>
      <VStack><Spacer size="20"></Spacer></VStack>
    </div>
  );
}
