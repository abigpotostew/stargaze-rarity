import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenSchema1647530992190 implements MigrationInterface {
    name = 'TokenSchema1647530992190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "traits" DROP CONSTRAINT "traits_contract_id_fkey"`);
        await queryRunner.query(`CREATE TABLE "token_meta" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "score" numeric NOT NULL, "contract_id" integer, "token_id" integer, CONSTRAINT "UQ_322ba9600c8bb4cb246940f7ff3" UNIQUE ("token_id", "contract_id"), CONSTRAINT "REL_bb193cf977e149f6c1279f8f8f" UNIQUE ("token_id"), CONSTRAINT "PK_c04f28dafc8c7c5b34d3ac8b903" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token_traits" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "trait_type" character varying(1024) NOT NULL, "value" character varying(1024) NOT NULL, "contract_id" integer, "token_id" integer, "trait_id" integer, CONSTRAINT "REL_13ac72155a579842fae45cbe80" UNIQUE ("trait_id"), CONSTRAINT "PK_98c348a79b393cfb9a6e0358460" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "token_id" character varying(1024) NOT NULL, "contract_id" integer, CONSTRAINT "UQ_d1f7114d5c02feb34d82f28112a" UNIQUE ("token_id", "contract_id"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "traits" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "traits" ADD "trait_type" character varying(1024) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" ADD "count" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "contract_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sg721s" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sg721s" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "traits" ADD CONSTRAINT "FK_425c80bd9ff7707f18a851200b2" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_meta" ADD CONSTRAINT "FK_f52aba0b1e973d66059f80099cd" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_meta" ADD CONSTRAINT "FK_bb193cf977e149f6c1279f8f8f2" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "FK_127ba7b430ab1fbaf824b5a11dc" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "FK_2c389fcbecb5fa95109ff0078e4" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_traits" ADD CONSTRAINT "FK_13ac72155a579842fae45cbe80b" FOREIGN KEY ("trait_id") REFERENCES "traits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_a09a820642da185ae817a51fc0e" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_a09a820642da185ae817a51fc0e"`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "FK_13ac72155a579842fae45cbe80b"`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "FK_2c389fcbecb5fa95109ff0078e4"`);
        await queryRunner.query(`ALTER TABLE "token_traits" DROP CONSTRAINT "FK_127ba7b430ab1fbaf824b5a11dc"`);
        await queryRunner.query(`ALTER TABLE "token_meta" DROP CONSTRAINT "FK_bb193cf977e149f6c1279f8f8f2"`);
        await queryRunner.query(`ALTER TABLE "token_meta" DROP CONSTRAINT "FK_f52aba0b1e973d66059f80099cd"`);
        await queryRunner.query(`ALTER TABLE "traits" DROP CONSTRAINT "FK_425c80bd9ff7707f18a851200b2"`);
        await queryRunner.query(`ALTER TABLE "sg721s" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sg721s" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "contract_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "traits" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "traits" DROP COLUMN "count"`);
        await queryRunner.query(`ALTER TABLE "traits" DROP COLUMN "trait_type"`);
        await queryRunner.query(`ALTER TABLE "traits" ADD "name" character varying(1024) NOT NULL`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "token_traits"`);
        await queryRunner.query(`DROP TABLE "token_meta"`);
        await queryRunner.query(`ALTER TABLE "traits" ADD CONSTRAINT "traits_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "sg721s"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
