import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface DashboardProps {
  signOut: () => void;
  user: any;
}

export default function Dashboard({ signOut, user }: DashboardProps) {
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

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>User Information</h2>
        <p><strong>Email:</strong> {userAttributes.email}</p>
        <p><strong>Riot ID:</strong> {userAttributes.riotId}</p>
        <p><strong>Region:</strong> {userAttributes.region}</p>
      </div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
