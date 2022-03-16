import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns";
import { Handler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { ApiResponse, isOk } from "./src/api/apiResponse";
import { handleCreateContract, handleReadContract,handleListContracts } from "./src/api/controller";
import { Services } from "./src/services";

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
  console.log(event)
  try {
    const { routeKey } = event
    switch (routeKey) {
      case 'GET /contracts': {
        const {page, limit} = event.queryStringParameters
        const response: ApiResponse = await handleListContracts(page, limit)
        return response
      }

      case 'POST /contracts/{contractId}': {
        const { pathParameters: { contractId } } = event
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

      case 'GET /contracts/{contractId}/rarities': {
        return {}
      }

      case 'GET /contracts/{contractId}/rarities/{tokenId}': {
        return {}
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