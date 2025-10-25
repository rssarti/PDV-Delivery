import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteColumnClient1761427484540 implements MigrationInterface {
  name = 'DeleteColumnClient1761427484540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "deleted_at"`);
  }
}
