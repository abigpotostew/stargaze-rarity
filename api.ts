import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns";
import { Context, Handler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { getManager } from "typeorm";
import { ApiResponse, isOk } from "./src/api/apiResponse";
import { handleCreateContract, handleReadContract } from "./src/api/controller";
import { SG721 } from "./src/database/entities/sg721.entity";
import { getServicesSingleton, Services } from "./src/services";
import { randomContract } from "./src/utils";

dotenv.config();

let services: Services | null = null
const { AWS_REGION: region, IS_OFFLINE: isOffline, METADATA_TOPIC_ARN: snsTopic } = process.env
const snsClient = new SNSClient({ region });

const publishSnsTopic = async (data) => {
  try {
    if (!isOffline && snsTopic) {
      const params: PublishCommandInput = {
        Message: JSON.stringify(data),
        TopicArn: snsTopic
      }
      const command = new PublishCommand(params);
      const result = await snsClient.send(command)
      return result
    }
    else {
      console.log("No SNS messages sent in offline mode")
    }

  } catch (err) {
    console.log("Error", err.stack);
  }
}

export const handler: Handler = async (event: any) => {
  try {
    const { routeKey } = event
    switch (routeKey) {
      case 'POST /contracts': {
        const { body } = event;
        const { contractId } = JSON.parse(body)
        const response: ApiResponse = await handleCreateContract(contractId)
        if (isOk(response)) {
          await publishSnsTopic({ contractId })
        }
        return response;
      }

      case 'GET /contracts/{contractId}': {
        const { pathParameters: { contractId } } = event
        const response: ApiResponse = await handleReadContract(contractId)
        return response
      }

      default: {
        throw new Error(`'${routeKey}' is not a supported route.`)
      }


    }
  } catch (e) {
    const { message } = e
    return {
      statusCode: 400,
      body: JSON.stringify({ message })
    }
  }

}