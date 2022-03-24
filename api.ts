import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns";
import { Handler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { ApiResponse } from "./src/api/apiResponse";
import { handleCreateContract, handleListContracts, handleListTokens, handleReadContract, handleReadToken } from "./src/api/controller";
import { Services } from "./src/services";
import { publishSnsTopic } from "./src/sns"

dotenv.config();

let services: Services | null = null


export const handler: Handler = async (event: any) => {
  console.log(event)
  try {
    const { routeKey } = event
    switch (routeKey) {
      case 'GET /contracts': {
        const { page, limit } = Object(event.queryStringParameters)
        const response: ApiResponse = await handleListContracts(page, limit)
        return response
      }

      case `POST /contracts/{contractId}`: {
        const { pathParameters: { contractId } } = event
        const response: ApiResponse = await handleCreateContract(contractId)
        return response;
      }

      case 'GET /contracts/{contractId}': {
        const { pathParameters: { contractId } } = event
        const response: ApiResponse = await handleReadContract(contractId)
        return response
      }

      case 'GET /contracts/{contractId}/rarities': {
        const { page, limit } = Object(event.queryStringParameters)
        const { pathParameters: { contractId } } = event
        const response: ApiResponse = await handleListTokens(contractId, page, limit)
        return response
      }

      case 'GET /contracts/{contractId}/rarities/{tokenId}': {
        const { pathParameters: { contractId, tokenId } } = event
        const response: ApiResponse = await handleReadToken(contractId, tokenId)
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