import { DataSource } from "typeorm";
import { dataSource } from "./database/dataSource";
import { Repository } from "./repository";

export class Services {
  public readonly db: DataSource;
  public readonly repo: Repository;

  constructor(db: DataSource, repo: Repository) {
    this.db = db;
    this.repo = repo;
  }
}

let services: Services | null = null;
export const getServicesSingleton = async () => {

  if (services === null) {
    const db = await dataSource.initialize()

    const repo = new Repository(db);
    services = new Services(db, repo);
  }
  return services;
}