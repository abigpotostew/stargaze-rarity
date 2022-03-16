
import { createContract, readContract } from "./service"
import { instanceToPlain, plainToClass } from "class-transformer";
import { ApiResponse } from "./apiResponse"

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

export {
    handleCreateContract,
    handleReadContract
}