export interface ContractMessage {
  contractId:string
}
export const createContractMessage=(contractId: string) :ContractMessage=> {
  return {
    contractId
  }
}