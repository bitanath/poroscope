import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconShare, IconSettings2, IconPower } from "@tabler/icons-react"; 

export function Dock({visible=true,signOut}:{visible:boolean;signOut:()=>void;}) {
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
      href: "/generated/share",
    },
    {
      title: "Sign Out",
      icon: (
        <IconPower className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      action: signOut,
    }
  ];
  return (
    <div className={`${!visible?"hidden":"block"} fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 opacity-80`}>
      <FloatingDock
        mobileClassName="fixed transform -translate-x-[48vw]!"
        items={links}
      />
    </div>
  );
}