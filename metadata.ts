import { Context, Handler } from 'aws-lambda';
import { QueryContract } from "./src/cosmwasm/sg721";
import { defaultConfig } from "./src/config";
import { downloadMetadata } from "./src/metadata/download";
import { Repository } from './src/repository';
import { getServicesSingleton } from './src/services';

const region = process.env.AWS_REGION

export const handler: Handler = async (event: any, context: Context) => {
    // console.log(event, context)
    const contractId = 'stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac'
    const metadata = await downloadMetadata(contractId)    
    const services = await getServicesSingleton()
    const output = services.repo.persistIngestedData(contractId, metadata.allTraits, metadata.tokenTraits, metadata.scores)
    return {
        statusCode:200,
        body: JSON.stringify(output)
    }
    
}