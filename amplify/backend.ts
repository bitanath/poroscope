import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineBackend } from '@aws-amplify/backend';
import { validateRiotId } from './functions/validate-riot-id/resource';

export const backend = defineBackend({
  auth,
  data,
  validateRiotId
});


