import { EntityTarget, Repository } from "typeorm";

export const defaultChunkSize = 25;

export const saveChunked = async <T>(
  repo: Repository<T>,
  entityTarget: EntityTarget<T>,
  entities: T[],
  contraintName: string,
  onConflictDoNothing: boolean,
  onConflictDoUpdate?: string,
  chunkSize = defaultChunkSize,
  returnFields?: string[],
) => {
  let i: number, j: number;
  for (i = 0, j = entities.length; i < j; i += chunkSize) {
    const insert = entities.slice(i, i + chunkSize);
    let query = (repo)
      .createQueryBuilder()
      .insert()
      .into(entityTarget)
      .values(insert);
    if (returnFields) {
      query = query.returning(returnFields);
    }
    if (onConflictDoNothing) {
      query = query.onConflict(`ON CONSTRAINT ${contraintName} DO NOTHING`);
    } else {
      query = query.onConflict(
        `ON CONSTRAINT ${contraintName} DO UPDATE SET ${onConflictDoUpdate}`,
      );
    }
    await query.execute();
  }
};
