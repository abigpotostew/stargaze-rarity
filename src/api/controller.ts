
import { instanceToPlain } from "class-transformer";
import { ApiResponse } from "./apiResponse";
import { createContract, readContract, listContracts } from "./service";

const toJson = (obj: any): string => JSON.stringify(instanceToPlain(obj))

const handleReturn = async (statusCode: number, callback: () => any): Promise<ApiResponse> => {
    try {
        const result = await callback();
        return {
            statusCode,
            body: toJson(result),
        }
    } catch (e) {
        const { message } = e
        return {
            statusCode: 400,
            body: toJson({ message })
        }
    }
}

const handleCreateContract = async (contractId): Promise<ApiResponse> => {
    return handleReturn(201, async () => {
        return await createContract(contractId)
    })
}

const handleReadContract = async (contractId) => {
    return handleReturn(200, async () => {
        return await readContract(contractId)
    })
}

const handleListContracts = async (page, limit) => {
    return handleReturn(200, async () => {
        return await listContracts(page, limit)
    })
}

export {
    handleCreateContract,
    handleReadContract,
    handleListContracts
};
