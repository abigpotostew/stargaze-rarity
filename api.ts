import { Context, Handler } from 'aws-lambda';
import { SNSClient, PublishCommand, PublishCommandInput, PublishCommandOutput } from "@aws-sdk/client-sns";
import * as dotenv from 'dotenv';
import { getManager } from "typeorm";
import { SG721 } from "./src/database/entities/sg721.entity";
import { Trait } from "./src/database/entities/trait.entity";
import { getServicesSingleton, Services } from "./src/services";
import { randomContract } from "./src/utils";

dotenv.config();

let services: Services | null = null
const { AWS_REGION: region, IS_OFFLINE: isOffline, METADATA_TOPIC_ARN:snsTopic } = process.env
const snsClient = new SNSClient({ region });
// console.log(snsTopic)

const publishSnsTopic = async (data) => {
  try {
    if (!isOffline && snsTopic) {
      const params: PublishCommandInput = {
        Message: JSON.stringify(data),
        TopicArn: snsTopic
      }
      const command = new PublishCommand(params);
      const result = await snsClient.send(command)
      console.log("Success", result)
      return result
    }
    else {
      console.log("No SNS messages sent in offline mode")
    }

  } catch (err) {
    console.log("Error", err.stack);
  }
}

const createContract: any = async (contractId: string) => {
  // Probably want to add some validation for contractId
  if (!services) {
    services = await getServicesSingleton()
  }


  const contract = await services.repo.createContract(contractId)

  const traitRepo = getManager().getRepository(Trait)
  const sampleTrait = traitRepo.create()
  sampleTrait.contract = contract
  sampleTrait.name = "sample trait name"
  await traitRepo.save(sampleTrait)

  return services.repo.getContract(contractId)

}

const handleCreateContract: Handler = async (event: any, context: Context) => {
  try {
    const { body } = event;
    const contractId = JSON.parse(body).contractId
    const contract = await createContract(contractId)
    const publish = await publishSnsTopic({ contractId })
    const response = {
      statusCode: 201,
      body: JSON.stringify(contract),
    };
    return response

  } catch (e) {
    return errReponse(e.message)
  }
}
const readContract: any = async (contractId: string) => {
  if (!services) {
    services = await getServicesSingleton()
  }
  return services.repo.getContract(contractId)
}

const handleReadContract: Handler = async (event: any, context: Context) => {
  try {
    const { pathParameters: { contractId } } = event
    const contract = await readContract(contractId)
    const response = {
      statusCode: 200,
      body: JSON.stringify(contract),
    };
    return response
  } catch (e) {
    return errReponse(e.message)
  }
}

const createRandom: Handler = async (event: any) => {
  if (!services) {
    services = await getServicesSingleton()
  }
  const req = event.requestContext.http

  // create a new SG721

  // not sure why but the sg721 file is not being compiled to commonjs
  const sg721repo = getManager().getRepository(SG721)
  const contract = sg721repo.create()
  contract.contract = await randomContract()

  const newcontract = await sg721repo.save(contract)
  const publish = await publishSnsTopic({ contractId: contract.contract })
  const response = {
    statusCode: 201,
    body: JSON.stringify(newcontract),
  };
  return response
}

const errReponse: any = (message: string) => {
  const response = {
    statusCode: 400,
    body: JSON.stringify(
      {
        message,
      },
      null,
      2
    ),
  };
  return response
}

const defaultResponse: Handler = async (event: any) => {
  const response = {
    statusCode: 404,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
  return response
}

export const handler: Handler = async (event: any, context: Context) => {
  const { routeKey } = event
  switch (routeKey) {
    case 'POST /contract':
      return handleCreateContract(event, context, null)
    case 'GET /contract/{contractId}':
      return handleReadContract(event, context, null)
    case 'POST /test-create':
      return createRandom(event, context, null);
  }
  return defaultResponse(event, null, null);

}