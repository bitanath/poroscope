import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { validateRiotId } from "../functions/validate-riot-id/resource";
import { summonerFetcher } from "../functions/summoner-fetcher/resource";
import { orchestrator } from "../functions/orchestrator/resource";

const schema = a.schema({
  validateRiotId: a
    .query()
    .arguments({
      gameName: a.string(),
      tagLine: a.string(),
      region: a.string()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(validateRiotId)),
  
  summonerFetcher: a
    .query()
    .arguments({
      fullName: a.string(),
      region: a.string()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(summonerFetcher)),

  orchestrator: a
    .query()
    .arguments({
      name: a.string(),
      region: a.string()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(orchestrator)),
})


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

