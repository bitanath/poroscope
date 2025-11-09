import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { validateRiotId } from "../functions/validate-riot-id/resource";
import { summonerFetcher } from "../functions/summoner-fetcher/resource";
import { orchestrator } from "../functions/orchestrator/resource";
import { publicFetcher } from "../functions/public-fetcher/resource";

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
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(summonerFetcher)),

  orchestrator: a
    .query()
    .arguments({
      name: a.string(),
      region: a.string(),
      delete: a.boolean(),
      cacheKey: a.string(),
      publicize: a.boolean()
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(orchestrator)),

  publicFetcher: a
    .query()
    .arguments({
      cacheKey: a.string(),
      publicize: a.boolean()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(publicFetcher)),

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

