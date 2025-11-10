## Poroscope

Coded for the Rift Rewind Hackathon c. 2025

### Overview

Uses Amazon AWS Amplify and Strands SDK with a hierarchically orchestrated agent architecture using a React+Vite frontend and Lambda backend to serve up AI generated summaries of player performance over 2025. Here's the obligatory service diagram

![architecture diagram](https://ik.imagekit.io/0jpx1foc3/architecture_diagram.png?updatedAt=1762740533490)

- **Lambdas** = Honestly where would we even be without serverless? All our processing is done on Lambdas, from validating a Riot ID, to fetching Summoner Profile, to Match Data.. everything
- **Strands SDK** = This made it super easy to deploy multiple agents on Lambda. We ended up using FIVE agents, orchestrated to form one cohesive insight!
- **Amazon Bedrock:Nova Micro** = We focused on keeping costs low, and splitting tasks and separating concerns across agents
- **Dynamo DB** = We cached data and added public access policies wherever the user made a shareable Poroscope.
- **API Gateway** = We used this for calling the lambdas as a specific resource (we also bypassed it and called high processing time Lambdas directly with authentication backed security)
- **Amazon Cognito** = We used this for user signup and signin, with custom fields to specify your Riot ID and Region to allow us to fetch data
- **Amazon Amplify** = Honestly this is probably the goat service, it coordinates between all the other services. The learning curve is steep but the reward is good. 
- **Amplify UI** = We built the frontend using the React+Vite quickstart available in the Amplify Docs.

### How to Use
Head over to [https://poroscope.space](https://poroscope.space) [while credits last] or for a pre-generated report you can check out [https://poroscope.space/generated/TWFkU2tpbHp6I05BMS1OQTE=](https://poroscope.space/generated/TWFkU2tpbHp6I05BMS1OQTE=)