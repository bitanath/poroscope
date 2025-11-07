import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const matchFetcher = defineFunction(
  (scope) => {
    return new Function(scope, "match-fetcher", {
      handler: "handler.handler",
      runtime: Runtime.PYTHON_3_10,
      timeout: Duration.seconds(900),
      memorySize: 3008,
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("public.ecr.aws/lambda/python:3.10"),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `python3 -m pip install -r ${path.join(functionDir, "requirements.txt")} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    });
  }
);
