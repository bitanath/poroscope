import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineBackend } from '@aws-amplify/backend';
import { validateRiotId } from './functions/validate-riot-id/resource';
import { matchFetcher } from './functions/match-fetcher/resource';
import { summonerFetcher } from './functions/summoner-fetcher/resource';
import { orchestrator } from './functions/orchestrator/resource';
import { publicFetcher } from './functions/public-fetcher/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const backend = defineBackend({
  auth,
  data,
  summonerFetcher,
  validateRiotId,
  matchFetcher,
  orchestrator,
  publicFetcher
});


backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [`arn:aws:lambda:*:*:function:amplify-*`]
  })
);

backend.publicFetcher.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: ['arn:aws:lambda:*:*:function:amplify-*']
  })
)