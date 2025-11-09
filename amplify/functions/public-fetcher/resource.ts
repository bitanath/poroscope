import { defineFunction } from '@aws-amplify/backend';

export const publicFetcher = defineFunction({
  name: 'public-fetcher',
  entry: './handler.ts',
  timeoutSeconds: 600,
  environment: {
    NAME: "Public Fetcher"
  },
  resourceGroupName: "riot-api"
});