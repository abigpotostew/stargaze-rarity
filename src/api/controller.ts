
import "reflect-metadata"
import { ClassConstructor, instanceToPlain, plainToClass } from "class-transformer";
import { ApiResponse } from "./apiResponse";
import { SG721Model } from "./models/sg721.model";
import { SG721SimpleModel } from "./models/sg721Simple.model";
import { TokenModel } from "./models/token.model";
import { createContract, readContract, listContracts, readToken, listTokens } from "./service";

const toJson = (obj: any): string => JSON.stringify(instanceToPlain(obj))

const convertModel = function <T, V>(klass: ClassConstructor<T>, obj: V): T | null {
    if (obj !== null) {
        return plainToClass(klass, obj)
    }
    return null
}

const handleReturn = async (statusCode: number, callback: () => any): Promise<ApiResponse> => {
    let payload
    try {
        const result = await callback();
        if (result === null || result === undefined) {
            const message = "Resource not found"
            payload =  {
                statusCode: 404,
                body: toJson({ message })
            }
        }
        else {
            payload =  {
                statusCode,
                body: toJson(result),
            }
        }
    } catch (e) {
        console.log(e)
        const { message } = e
        payload =  {
            statusCode: 400,
            body: toJson({ message })
        }
    }
    payload.headers = {
        "Content-Type": "application/json"
    }
    return payload;
}

const handleCreateContract = async (contractId): Promise<ApiResponse> => {
    return handleReturn(201, async () => {
        const contract = await createContract(contractId)
        return convertModel(SG721SimpleModel, contract)
    })
}

const handleReadContract = async (contractId) => {
    return handleReturn(200, async () => {
        const contract = await readContract(contractId)
        return convertModel(SG721Model, contract)
    })
}

const handleListContracts = async (page, limit) => {
    return handleReturn(200, async () => {
        const contracts = await listContracts(page, limit)
        return contracts.map((c) => convertModel(SG721SimpleModel, c))
    })
}

const handleListTokens = async (contractId, page, limit) => {
    return handleReturn(200, async () => {
        const tokens = await listTokens(contractId, page, limit)
        return tokens.map((t) => convertModel(TokenModel, t))
    })
}

const handleReadToken = async (contractId, tokenId) => {
    return handleReturn(200, async () => {
        const token = await readToken(contractId, tokenId)
        return convertModel(TokenModel, token)
    })
}

export {
    handleCreateContract,
    handleReadContract,
    handleListContracts,
    handleReadToken,
    handleListTokens
};
