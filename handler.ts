import { Handler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { connectDatabase } from "./src/database/pg";
import { Connection, getManager } from "typeorm";
import { SG721s } from "./src/database/entities/sg721.entity";

dotenv.config();

let db: Connection | null = null

export const hello: Handler = async (event: any) => {
  if (!db) {
    db = await connectDatabase()
  }
  const req = event.requestContext.http
  if (req.method === 'POST' && req.path === '/test-create') {
    // create a new SG721
    
    // not sure why but the sg721 file is not being compiled to commonjs
    const newcontract = await getManager().getRepository(SG721s).save({})
    const response = {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'created: ' + newcontract.id,
        }),
    };
    return response
    // return new Promise((resolve) => {
    //   resolve(response)
    // })
  }

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
  // return new Promise((resolve) => {
  //   resolve(response)
  // })
}