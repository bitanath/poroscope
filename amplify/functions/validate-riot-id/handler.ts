import {env} from '$amplify/env/validate-riot-id'
import type { Schema } from "../../data/resource"

export const handler: Schema["validateRiotId"]["functionHandler"] = async (event,context) => {
  try {
    const { gameName, tagLine } = event.arguments;
    
    if (!gameName || !tagLine) {
      return {
        valid: false,
        message: 'Missing gameName or tagLine'
      };
    }

    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        method: 'GET',
        headers: {
          'X-Riot-Token': env.API_KEY!,
          'Accept': 'application/json',
        }
      }
    );
    console.log(response.headers)
    console.log(response.statusText)
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