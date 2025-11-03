interface DashboardProps {
  signOut: () => void;
}

export default function Dashboard({ signOut }: DashboardProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
