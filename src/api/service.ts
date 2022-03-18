import { SG721 } from "../database/entities/sg721.entity";
import { Token } from "../database/entities/token.entity";
import { getServicesSingleton, Services } from "../services";

let services: Services | null = null
const pageLimit: number = 30

const createContract = async (contractId: string): Promise<SG721> => {
    // Probably want to add some validation for contractId
    if (!services) {
        services = await getServicesSingleton()
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