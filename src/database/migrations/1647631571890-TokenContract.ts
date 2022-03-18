import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenContract1647631571890 implements MigrationInterface {
    name = 'TokenContract1647631571890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "contract_address" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_a09a820642da185ae817a51fc0e"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "UQ_d1f7114d5c02feb34d82f28112a"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "contract_id" integer`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "FK_13ac72155a579842fae45cbe80b"`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "REL_13ac72155a579842fae45cbe80"`);
        await queryRunner.query(`ALTER TABLE "sg721s" DROP CONSTRAINT "sg721s_contract_key"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "UQ_d1f7114d5c02feb34d82f28112a" UNIQUE ("token_id", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "UQ_2efe151cf3bf9b7872486989da3" UNIQUE ("contract_id", "trait_type", "value")`);
        await queryRunner.query(`ALTER TABLE "sg721_traits" ADD CONSTRAINT "UQ_b40f9903413f8220b55d7a5f05c" UNIQUE ("contract_id", "trait_type", "value")`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_a09a820642da185ae817a51fc0e" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "FK_13ac72155a579842fae45cbe80b" FOREIGN KEY ("trait_id") REFERENCES "sg721_traits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "FK_13ac72155a579842fae45cbe80b"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_a09a820642da185ae817a51fc0e"`);
        await queryRunner.query(`ALTER TABLE "sg721_traits" DROP CONSTRAINT "UQ_b40f9903413f8220b55d7a5f05c"`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "UQ_2efe151cf3bf9b7872486989da3"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "UQ_d1f7114d5c02feb34d82f28112a"`);
        await queryRunner.query(`ALTER TABLE "sg721s" ADD CONSTRAINT "sg721s_contract_key" UNIQUE ("contract")`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "REL_13ac72155a579842fae45cbe80" UNIQUE ("trait_id")`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "FK_13ac72155a579842fae45cbe80b" FOREIGN KEY ("trait_id") REFERENCES "sg721_traits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "contract_id"`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD "contract_id" character varying(64)`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "UQ_d1f7114d5c02feb34d82f28112a" UNIQUE ("token_id", "contract_id")`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_a09a820642da185ae817a51fc0e" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("contract") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "contract_address"`);
    }

}
