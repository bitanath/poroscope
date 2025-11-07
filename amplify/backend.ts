import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineBackend } from '@aws-amplify/backend';
import { validateRiotId } from './functions/validate-riot-id/resource';
import { matchFetcher } from './functions/match-fetcher/resource';
import { summonerFetcher } from './functions/summoner-fetcher/resource';
import { orchestrator } from './functions/orchestrator/resource';

export const backend = defineBackend({
  auth,
  data,
  summonerFetcher,
  validateRiotId,
  matchFetcher,
  orchestrator
});


