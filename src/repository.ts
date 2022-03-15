import { SG721 } from "./database/entities/sg721.entity";
import { Connection, getManager } from "typeorm";

export class Repository {
  private readonly db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getContract(contractId: string): Promise<SG721 | undefined> {
    return await this.db.manager.getRepository(SG721).findOne({ contract: contractId }, { relations: ["traits"] });
  }
  
  async createContract(contractId: string): Promise<SG721> {
    const sg721repo = this.db.manager.getRepository(SG721)
    let contract = sg721repo.create()
    contract.contract = contractId

    return await sg721repo.save(contract)
  }
}