import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { validateRiotId } from "../functions/validate-riot-id/resource";

const schema = a.schema({
  validateRiotId: a
    .query()
    .arguments({
      gameName: a.string(),
      tagLine: a.string()
    })
    .returns(a.json())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(validateRiotId)),
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

