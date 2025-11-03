import { defineFunction,secret } from '@aws-amplify/backend';

export const validateRiotId = defineFunction({
  name: 'validate-riot-id',
  entry: './handler.ts',
  timeoutSeconds: 60,
  environment: {
    NAME: "Validate Riot Id",
    API_KEY: secret('RIOT_API_KEY')
  }
});