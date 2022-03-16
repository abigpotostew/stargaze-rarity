import { instanceToPlain } from "class-transformer";
import { SG721 } from "../database/entities/sg721.entity";
import { getServicesSingleton, Services } from "../services";

let services: Services | null = null
const pageLimit:number = 30

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

const listContracts = async(page:number | undefined, limit:number | undefined): Promise<SG721[]> => {
    const take = limit && limit <= pageLimit ? limit : pageLimit
    const skip = page && page > 1 ? (page - 1) * take : 0
    if (!services) {
        services = await getServicesSingleton()
    }
    return services.repo.getContracts(take, skip)
}


export {
    createContract,
    readContract,
    listContracts
}