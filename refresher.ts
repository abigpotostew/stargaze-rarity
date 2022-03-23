import { Context, Handler } from 'aws-lambda';
import { getServicesSingleton } from './src/services';
import {  instanceToPlain, plainToClass } from "class-transformer";
import { SG721Model } from './src/api/models/sg721.model';
import parse from 'parse-duration'
import {publishSnsTopic} from "./src/sns"

const refreshInterval = process.env.REFRESH_FREQUENCY

export const handler: Handler = async (event: any, context: Context) => {
    // console.log(event, context)
    // console.log(process.env)
    // console.log(refreshInterval)
    const services = await getServicesSingleton()

    // let's just make sure we have a valid interval
    if (parse(refreshInterval) > 0) {
        const contracts = await services.repo.getContractsToRefresh(refreshInterval)
        await services.repo.refreshContracts(contracts)
        contracts.forEach((c) => {
            publishSnsTopic({contractId:c.id})
        })
        
        return await JSON.stringify(instanceToPlain(plainToClass(SG721Model, contracts)))
    } else {
        throw new Error(`invalid interval received ${refreshInterval}`)
    }
}