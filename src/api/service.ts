import { SG721 } from "../database/entities/sg721.entity";
import { Token } from "../database/entities/token.entity";
import { getServicesSingleton, Services } from "../services";
import { contractRegex } from "../utils";

let services: Services | null = null
const pageLimit: number = 30

const createContract = async (contractId: string): Promise<SG721|null> => {
    // Probably want to add some validation for contractId
    if (!services) {
        services = await getServicesSingleton()
    }
    
    if(!contractRegex.test(contractId) ){
        console.log(`contract address '${contractId}' is not a sg721 address`)
        return null;
    }
    const isSg721 = await services.query.isSg721(contractId)
    if(!isSg721){
        const isMinter = await services.query.isMinter(contractId)
        if(!isMinter){
            console.log(`contract address '${contractId}' is not a sg721 or minter address`)
            return null;
        }else{
            contractId = await services.query.getSg721Address(contractId)
        }
    }

    const existing =await services.repo.getContract(contractId) 
    if(existing) {
        return existing
    }
    await services.repo.createContract(contractId)
    return services.repo.getContract(contractId)
}

const readContract = async (contractId: string): Promise<SG721> => {
    if (!services) {
        services = await getServicesSingleton()
    }
    return services.repo.getContract(contractId)
}

const listContracts = async (page: number | undefined, limit: number | undefined): Promise<SG721[]> => {
    const take = limit && limit <= pageLimit ? limit : pageLimit
    const skip = page && page > 1 ? (page - 1) * take : 0
    if (!services) {
        services = await getServicesSingleton()
    }
    return services.repo.getContracts(take, skip)
}


const listTokens = async (contractId: string, page: number | undefined, limit: number | undefined): Promise<Token[]> => {
    const take = limit && limit <= pageLimit ? limit : pageLimit
    const skip = page && page > 1 ? (page - 1) * take : 0
    if (!services) {
        services = await getServicesSingleton()
    }
    return services.repo.getTokens(contractId, take, skip)
}

const readToken = async (contractId: string, tokenId: string): Promise<Token> => {
    if (!services) {
        services = await getServicesSingleton()
    }
    return services.repo.getToken(contractId, tokenId)
}


export {
    createContract,
    readContract,
    listContracts,
    readToken,
    listTokens
}