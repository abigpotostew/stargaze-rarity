
import { instanceToPlain, plainToClass } from "class-transformer";
import { ApiResponse } from "./apiResponse";
import { SG721Model } from "./models/sg721.model";
import { SG721SimpleModel } from "./models/sg721Simple.model";
import { TokenModel } from "./models/token.model";
import { createContract, readContract, listContracts, readToken, listTokens } from "./service";

const toJson = (obj: any): string => JSON.stringify(instanceToPlain(obj))

const handleReturn = async (statusCode: number, callback: () => any): Promise<ApiResponse> => {
    try {
        const result = await callback();
        return {
            statusCode,
            body: toJson(result),
        }
    } catch (e) {
        console.log(e)
        const { message } = e
        return {
            statusCode: 400,
            body: toJson({ message })
        }
    }
}

const handleCreateContract = async (contractId): Promise<ApiResponse> => {
    return handleReturn(201, async () => {
        const contract = await createContract(contractId)
        return plainToClass(SG721SimpleModel, contract)
    })
}

const handleReadContract = async (contractId) => {
    return handleReturn(200, async () => {
        const contract = await readContract(contractId)
        return plainToClass(SG721Model, contract)
    })
}

const handleListContracts = async (page, limit) => {
    return handleReturn(200, async () => {
        const contracts = await listContracts(page, limit)
        return contracts.map((c) => plainToClass(SG721SimpleModel, c))
    })
}

const handleListTokens = async (contractId, page, limit) => {
    return handleReturn(200, async () => {
        const tokens = await listTokens(contractId, page, limit)
        return tokens.map((t) => plainToClass(TokenModel, t))
    })
}

const handleReadToken = async (contractId, tokenId) => {
    return handleReturn(200, async () => {
        const token = await readToken(contractId, tokenId)
        return plainToClass(TokenModel, token)
    })
}

export {
    handleCreateContract,
    handleReadContract,
    handleListContracts,
    handleReadToken,
    handleListTokens
};
