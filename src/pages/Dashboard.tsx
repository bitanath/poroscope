import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AccountSettings } from '@aws-amplify/ui-react';
 import { useNavigate,useParams } from "react-router-dom";
 import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
 import {
   IconUserCheck,
   IconLogout,
   IconHome,
   IconPower,
   IconTrash
 } from "@tabler/icons-react";
import { VStack } from '@/components/sections/Stacks';
import Background from '@/components/sections/Background';

interface DashboardProps {
  signOut: () => void;
}


export function BentoGridPreferences({items}:{items:Array<any>;}) {
  return (
    <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[22rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

export default function Dashboard({ signOut }: DashboardProps) {
  const navigate = useNavigate()
  const {rewind} = useParams()
  const [userAttributes, setUserAttributes] = useState<any>({});

  useEffect(() => {
    const getAttributes = async () => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.payload;
        console.log(session,token)
        setUserAttributes({
          email: token?.['email'],
          riotId: token?.['preferred_username'],
          region: token?.['zoneinfo']
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getAttributes();
  }, []);
  const handleBackHome = () =>{
    navigate("/home")
  }

  const handleDeletion = ()=>{
    navigate("/")
  }
  const handlePassword = ()=>{
    navigate("/")
  }

  const items = [
    {
      title: "Account Details",
      description: "This is all the information we have on you.",
      header: <div>
        <h2 className='text-lg font-bold text-gray-600'>Summoner Information</h2>
        <p><strong>Rewind:</strong>{rewind}</p>
        <p><strong>Email:</strong> {userAttributes.email}</p>
        <p><strong>Riot ID:</strong> {userAttributes.riotId}</p>
        <p><strong>Region:</strong> {userAttributes.region}</p>
      </div>,
      className: "md:col-span-2",
      icon: <IconUserCheck className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Delete Account",
      description: "Warning! No takesies backsies.",
      header: <VStack alignItems={"center"} justifyContent={"center"} height={280}>
          <AccountSettings.DeleteUser onSuccess={handleDeletion} />
        </VStack>,
      className: "md:col-span-1",
      icon: <IconTrash className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Sign Out",
      description: "Sign out of Poroscope or just go back Home.",
      header: <VStack alignItems={"center"} justifyContent={"center"} height={280}>
        <button onClick={signOut} className="flex items-center gap-2 px-4 py-2">
          <IconLogout size={16} />
          Sign Out
        </button>
        <button onClick={handleBackHome} className="flex items-center gap-2 px-4 py-2">
          <IconHome size={16} />
          Back Home
        </button>
      </VStack>,
      className: "md:col-span-1",
      icon: <IconPower className="h-4 w-4 text-neutral-500" />,
    },
    {
      header: <div className='max-h-[520px]!'>
          <AccountSettings.ChangePassword onSuccess={handlePassword}/>
        </div>,
      className: "md:col-span-2",
    },
  ]

  return (
    <>
      <Background></Background>
      <BentoGridPreferences items={items}></BentoGridPreferences>
    </>
  );
}
