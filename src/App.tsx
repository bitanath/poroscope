import { Authenticator, useAuthenticator, TextField } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThreeBackground from './components/sections/ThreeBackground';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import '@aws-amplify/ui-react/styles.css'
import { generateClient } from 'aws-amplify/api';
import type {Schema} from "amplify/data/resource"

import './App.css'

export default function App() {
  const validateRiotId = async (gameName: string, tagLine: string):Promise<boolean> => {
    try {
      const client = generateClient<Schema>()
      const result = await client.queries.validateRiotId({
        gameName: gameName,
        tagLine: tagLine
      })
      if (!result || !result.data){
        console.log(result)
        throw new Error("Unable to check madar id:"+result.toString())
      }
      const returned = result.data
      let data
      if(typeof returned == "string"){
        data = JSON.parse(returned) as { valid: boolean; message: string };
      }else{  
        data = returned as { valid: boolean; message: string };
      }
      
      if(!data.valid){
        const typed = typeof data
        if(data.message !== "Success") throw new Error("Errored out with message "+data.message+" "+data.valid+" "+typed+" ")
        return data.valid
      }
      return data.valid
    } catch (error) {
      console.log(error)
      return false;
    }
  };

  return (
    <>
      <Authenticator
        initialState="signUp"
        components={{
          Header() {
            return <ThreeBackground />;
          },
          SignUp: {
            FormFields() {
              const { validationErrors } = useAuthenticator();

              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <TextField
                    errorMessage={validationErrors.riotId as string}
                    hasError={!!validationErrors.riotId}
                    name="riotId"
                    label="Riot User Id (xyz#ABC)"
                    isRequired={true}
                    placeholder="Enter your Riot Game Name with Tag (e.g., MadSkilzz#NA1)"
                  />
                </>
              );
            },
          },
        }}
        services={{
          async validateCustomSignUp(formData) {
            if (!formData.riotId) {
              return {
                riotId: 'Riot id is required'
              };
            } else if (!/.*?#.*?/ig.test(formData.riotId)) {
              return {
                riotId: 'Riot id is of the format: Game Name#TagLine'
              };
            } else {
              try {
                const [name, tag] = formData.riotId.split("#")
                const validated = await validateRiotId(name, tag)
                if (!validated) {
                  return { riotId: "Invalid Riot Id. Please check you've played at least 1 game." }
                }
              } catch (e: any) {
                return {
                  riotId: `${e.toString()}`
                }
              }
            }
          },
        }}>
        {({ signOut, user }) => (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage signOut={signOut!} />} />
              <Route path="/dashboard" element={<Dashboard signOut={signOut!} />} />
              <Route path="/ssr" element={<HomePage signOut={signOut!} />} />
            </Routes>
          </BrowserRouter>
        )}
      </Authenticator>
    </>
  );
}
