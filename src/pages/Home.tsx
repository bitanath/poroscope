import { Loading } from "@/components/sections/Loader";
import { useState } from "react";
import {VStack,Spacer} from "@/components/sections/Stacks"

import { LightBoard } from "@/components/ui/lightboard";

const loadingStates = [ { text: "Buying a condo", }, { text: "Travelling in a flight", }, { text: "Meeting Tyler Durden", }, { text: "He makes soap", }, { text: "We goto a bar", }, { text: "Start a fight", }, { text: "We like it", }, { text: "Welcome to F**** C***", }]

interface HomeProps {
  signOut: () => void;
}

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconShare,
  IconSettings2,
  IconDownload
} from "@tabler/icons-react";
import Sticky from "@/components/sections/Sticky";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Fork on GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      
      title: "Preferences",
      icon: (
        <IconSettings2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Share",
      icon: (
        <IconShare className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
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
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
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
      <div className="max-w-screen w-screen bg-black">
        <LightBoard
          rows={25}
          lightSize={4}
          gap={1}
          text="Colors of the Rainbow"
          font="default"
          updateInterval={200}
          colors={{
            background: "#1a1a1a",
            textDim: "#ff9999",
            drawLine: "#ffff99",
            textBright: "#99ffff",
          }}
        />
      </div>
      <Sticky></Sticky>
      <VStack><Spacer size="20"></Spacer></VStack>
      <button style={{display:"none"}} onClick={signOut}></button>
      <FloatingDockDemo/>
    </div>
  );
}
