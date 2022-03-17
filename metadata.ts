import { Context, Handler } from 'aws-lambda';
import { QueryContract } from "./src/cosmwasm/sg721";
import { defaultConfig } from "./src/config";
import { downloadMetadata } from "./src/metadata/download";

const region = process.env.AWS_REGION


export const handler: Handler = async (event: any, context: Context) => {
    console.log(event, context)
    await downloadMetadata('stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac')
}