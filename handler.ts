import { Context, Handler, } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { connectDatabase } from "./src/database/pg";
import { Connection, getManager } from "typeorm";
import { SG721s } from "./src/database/entities/sg721.entity";
import { randomContract } from "./src/utils"

dotenv.config();

let db: Connection | null = null

const createContract: any = async (contractId: string) => {
  // Probably want to add some validation for contractId
  if (!db) {
    db = await connectDatabase()
  }
  const sg721repo = getManager().getRepository(SG721s)
  const contract = sg721repo.create()
  contract.contract = contractId

  return await sg721repo.save(contract)
}

const handleCreateContract: Handler = async (event: any, context: Context) => {
  try {
    const { body } = event;
    const contractId = JSON.parse(body).contractId
    const contract = await createContract(contractId)
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
  if (!db) {
    db = await connectDatabase()
    const sg721repo = getManager().getRepository(SG721s); // you can also get it via getConnection().manager
    const contract: SG721s = await sg721repo.findOne({ contract: contractId });
    return contract
  }
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
  if (!db) {
    db = await connectDatabase()
  }
  const req = event.requestContext.http

  // create a new SG721

  // not sure why but the sg721 file is not being compiled to commonjs
  const sg721repo = getManager().getRepository(SG721s)
  const contract = sg721repo.create()
  contract.contract = await randomContract()

  const newcontract = await sg721repo.save(contract)
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
  const req = event.requestContext.http
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