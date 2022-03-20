import { Context, Handler } from 'aws-lambda';
import { QueryContract } from "./src/cosmwasm/sg721";
import { defaultConfig } from "./src/config";
import { downloadMetadata } from "./src/metadata/download";
import { Repository } from './src/repository';
import { getServicesSingleton } from './src/services';

const region = process.env.AWS_REGION

export const handler: Handler = async (event: any, context: Context) => {
    // console.log(event, context)
    console.log("EVENT",event)
    console.log("CONTEXT",context)
    // const contractId = 'stars1ltd0maxmte3xf4zshta9j5djrq9cl692ctsp9u5q0p9wss0f5lmsvd9ukk'
    const contractId = 'stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac'//stew
    console.log('testing contract', contractId)
    const metadata = await downloadMetadata(contractId)    
    const services = await getServicesSingleton()
    const output = await services.repo.persistIngestedData(
        contractId,
        metadata.allTraits,
        metadata.tokenTraits,
        metadata.scores,
        metadata.rankings,
        )
    return {
        statusCode:200,
        body: JSON.stringify({traits:output.traits.length, tokens:output.tokens.length})
    }
}