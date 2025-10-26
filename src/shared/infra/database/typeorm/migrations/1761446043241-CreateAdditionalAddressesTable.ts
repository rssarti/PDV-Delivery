import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdditionalAddressesTable1761446043241
  implements MigrationInterface
{
  name = 'CreateAdditionalAddressesTable1761446043241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "additional_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "address" character varying NOT NULL, "address_number" character varying NOT NULL, "neighborhood" character varying NOT NULL, "complement" character varying, "zip_code" character varying NOT NULL, "latitude" numeric(10,8), "longitude" numeric(11,8), "label" character varying NOT NULL, "is_favorite" boolean NOT NULL DEFAULT false, "used_count" integer NOT NULL DEFAULT '0', "last_used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1289d0dd0349d98fd5ee76f0441" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "additional_addresses" ADD CONSTRAINT "FK_cb18e35fa3bbf1c93c36e1880d4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "additional_addresses" DROP CONSTRAINT "FK_cb18e35fa3bbf1c93c36e1880d4"`
    );
    await queryRunner.query(`DROP TABLE "additional_addresses"`);
  }
}
