import { DataSource } from "typeorm";
import { dataSource } from "./database/dataSource";
import { Repository } from "./repository";
import { QueryContract } from "./cosmwasm/sg721";
import { defaultConfig } from "./config";

export class Services {
  public readonly db: DataSource;
  public readonly repo: Repository;
  public readonly query: QueryContract;

  constructor(db: DataSource, repo: Repository, query: QueryContract) {
    this.db = db;
    this.repo = repo;
    this.query = query;
  }
}

let services: Services | null = null;
export const getServicesSingleton = async () => {

  if (services === null) {
    const db = await dataSource.initialize()

    const repo = new Repository(db);
    const query = await QueryContract.init(defaultConfig())
    services = new Services(db, repo, query);
  }
  return services;
}