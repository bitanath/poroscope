import {env} from '$amplify/env/validate-riot-id'
import type { Schema } from "../../data/resource"

type Region = 'BR1' | 'EUN1' | 'EUW1' | 'JP1' | 'KR' | 'LA1' | 'LA2' | 'ME1' | 'NA1' | 'OC1' | 'RU' | 'SG2' | 'TR1' | 'TW2' | 'VN2';
type MegaRegion = 'americas' | 'europe' | 'asia';

export const handler: Schema["validateRiotId"]["functionHandler"] = async (event,context) => {
  try {
    const { gameName, tagLine, region } = event.arguments;
    
    if (!gameName || !tagLine) {
      return {
        valid: false,
        message: 'Missing gameName or tagLine'
      };
    }

    let mega:string = "americas"
    if(region){
      mega = getMegaRegion(region as Region)
    }

    const response = await fetch(
      `https://${mega}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        method: 'GET',
        headers: {
          'X-Riot-Token': env.API_KEY!,
          'Accept': 'application/json',
        }
      }
    );
    
    return {
      valid: response.ok,
      message: "Success"
    };
  } catch (error:any) {
    return {
      valid: false,
      message: error.toString()
    };
  }
};

function getMegaRegion(region: Region): MegaRegion {
  const regionMap: Record<Region, MegaRegion> = {
    'BR1': 'americas',
    'LA1': 'americas', 
    'LA2': 'americas',
    'NA1': 'americas',
    'OC1': 'americas',
    'EUN1': 'europe',
    'EUW1': 'europe',
    'ME1': 'europe',
    'RU': 'europe',
    'TR1': 'europe',
    'JP1': 'asia',
    'KR': 'asia',
    'SG2': 'asia',
    'TW2': 'asia',
    'VN2': 'asia'
  };
  
  return regionMap[region];
}