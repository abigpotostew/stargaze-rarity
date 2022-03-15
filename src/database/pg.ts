import { createConnection } from "typeorm";

export const connectDatabase = async () => {
  try {
    return await createConnection()
  } catch (error) {
    console.log(`Unable to connect to the database: ${error}.`);
    throw error;
  }
}

