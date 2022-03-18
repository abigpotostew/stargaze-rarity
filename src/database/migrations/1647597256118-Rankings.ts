import {MigrationInterface, QueryRunner} from "typeorm";

export class Rankings1647597256118 implements MigrationInterface {
    name = 'Rankings1647597256118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token_meta" ADD "rank" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token_meta" DROP COLUMN "rank"`);
    }

}
