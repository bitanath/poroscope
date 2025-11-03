import { Loading } from "@/components/sections/Loader";

interface HomePageProps {
  signOut: () => void;
}

export default function HomePage({ signOut }: HomePageProps) {
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={signOut}>Sign Out</button>
      <Loading></Loading>
    </div>
  );
}
