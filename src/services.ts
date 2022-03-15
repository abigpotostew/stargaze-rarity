import { Repository } from "./repository";
import { Connection } from "typeorm";
import { connectDatabase } from "./database/pg";

export class Services {
  public readonly db: Connection;
  public readonly repo: Repository;

  constructor(db: Connection, repo: Repository) {
    this.db = db;
    this.repo = repo;
  }
}

let services: Services | null = null;
export const getServicesSingleton = async () => {

  if (services === null) {
    const db = await connectDatabase()
    const repo = new Repository(db);
    services = new Services(db, repo);
  }
  return services;
}