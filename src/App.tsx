import Background from './components/sections/Background';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

import { generateClient } from 'aws-amplify/api';
import type {Schema} from "amplify/data/resource";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator, useAuthenticator, TextField, SelectField } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css'
import './css/signup.css'


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
  }

  return (
    <>
      <Authenticator
        initialState="signIn"
        components={{
          Header() {
            return <Background />;
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
                    name="preferred_username"
                    label="Riot User Id (xyz#ABC)"
                    isRequired={true}
                    placeholder="Enter your Riot Game Name with Tag (e.g., MadSkilzz#NA1)"
                  />
                  <SelectField
                    errorMessage={validationErrors.region as string}
                    hasError={!!validationErrors.region}
                    name="zoneinfo"
                    label="Region"
                    isRequired={true}
                  >
                    <option value="">Select Region</option>
                    <option value="BR1">BR1</option>
                    <option value="EUN1">EUN1</option>
                    <option value="EUW1">EUW1</option>
                    <option value="JP1">JP1</option>
                    <option value="KR">KR</option>
                    <option value="LA1">LA1</option>
                    <option value="LA2">LA2</option>
                    <option value="ME1">ME1</option>
                    <option value="NA1">NA1</option>
                    <option value="OC1">OC1</option>
                    <option value="RU">RU</option>
                    <option value="SG2">SG2</option>
                    <option value="TR1">TR1</option>
                    <option value="TW2">TW2</option>
                    <option value="VN2">VN2</option>
                  </SelectField>
                </>
              );
            },
          },
        }}
        services={{
          async validateCustomSignUp(formData) {
            const errors: any = {};
            console.log(formData)
            const riotId:string|undefined = formData['preferred_username']
            const region:string|undefined = formData['zoneinfo']
            if (!riotId) {
              errors.riotId = 'Riot id is required';
            } else if (!/.*?#.*?/ig.test(riotId)) {
              errors.riotId = 'Riot id is of the format: Game Name#TagLine';
            } else {
              try {
                const [name, tag] = riotId.split("#")
                if(tag.length < 3) throw 'Invalid tag line (format Game Name#TagLine)'
                const validated = await validateRiotId(name, tag)
                if (!validated) {
                  errors.riotId = "Invalid Riot Id. Please check you've played at least 1 game."
                }
              } catch (e: any) {
                errors.riotId = `${e.toString()}`
              }
            }

            if (!region) {
              errors.region = 'Region is required';
            }

            return Object.keys(errors).length > 0 ? errors : undefined;
          }
        }}>
        {({ signOut, user }) => (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home signOut={signOut!} />} />
              <Route path="/home" element={<Home signOut={signOut!} />} />
              <Route path="/dashboard" element={<Dashboard signOut={signOut!} user={user!} />} />
              <Route path="/ssr" element={<Home signOut={signOut!} />} />
            </Routes>
          </BrowserRouter>
        )}
      </Authenticator>
    </>
  );
}
