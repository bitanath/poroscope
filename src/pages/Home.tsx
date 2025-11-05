import { useState } from "react";
import { Loading } from "@/components/sections/Loader";
import {VStack,Spacer} from "@/components/sections/Stacks"

import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconShare, IconSettings2, IconDownload } from "@tabler/icons-react"; import Sticky from "@/components/sections/Sticky";

const loadingStates = [ { text: "Fetching Summoner Profile", }, { text: "Fetching Matches", }, { text: "Understanding Match Data", }, { text: "Understanding Champion Statistics", }, { text: "Identifying Competitive Insights", }, { text: "Preparing Report", }, { text: "Ready to Go!", }]

interface HomeProps {
  signOut: () => void;
}


export function FloatingDockDemo() {
  const links = [
    {
      title: "Fork on GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/bitanath/poroscope",
    },
    {
      
      title: "Preferences",
      icon: (
        <IconSettings2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },
    {
      title: "Share",
      icon: (
        <IconShare className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard",
    },

    {
      title: "Download",
      icon: (
        <IconDownload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    }
  ];
  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 opacity-60">
      <FloatingDock
        mobileClassName="fixed transform -translate-x-[48vw]!"
        items={links}
      />
  </div>
  );
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
      
      <Sticky></Sticky>
      <VStack><Spacer size="20"></Spacer></VStack>
      <button style={{display:"none"}} onClick={signOut}></button>
      <FloatingDockDemo/>
    </div>
  );
}
