import { MigrationInterface, QueryRunner } from 'typeorm';

export class Softdelete1756985589036 implements MigrationInterface {
  name = 'Softdelete1756985589036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deletedAt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "deletedAt" boolean NOT NULL DEFAULT false`,
    );
  }
}
