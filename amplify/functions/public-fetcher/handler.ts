import type { Schema } from "../../data/resource"
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

export const handler: Schema["publicFetcher"]["functionHandler"] = async (event, context) => {
  const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });
  
  try {
    const command = new InvokeCommand({
      FunctionName: 'amplify-d17o49q02hg78d-main-b-orchestratorDDCE86FA-h6z54lCpyUFr', // Use actual function name
      Payload: JSON.stringify({
        arguments: {
          cacheKey: event.arguments.cacheKey,
          publicize: event.arguments.publicize
        }
      })
    });
    
    const response = await lambdaClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    
    return result;
  } catch (error) {
    console.error('Error calling private lambda:', error);
    throw error;
  }
};
