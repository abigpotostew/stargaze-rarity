import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1647364303762 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists "traits"`);
    await queryRunner.query(`drop table if exists "sg721s"`);
    await queryRunner.query(`create table sg721s
                             (
                                 id         SERIAL PRIMARY KEY,
                                 contract   varchar(64) not null unique,
                                 created_at timestamp DEFAULT CURRENT_TIMESTAMP
                             );`);
    await queryRunner.query(`create table traits
                             (
                                 id          SERIAL PRIMARY KEY,
                                 name        varchar(1024) not null,
                                 contract_id integer       not null
                                     references sg721s (id)
                                         on delete cascade,
                                 created_at  timestamp DEFAULT CURRENT_TIMESTAMP
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //normal down should undo the up changes.
    // But since this is the first ever, no revert needed, re-enable syncronize on ormconfig.js to revert
  }

}
