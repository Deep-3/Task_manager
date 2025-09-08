import { MigrationInterface, QueryRunner } from 'typeorm';

export class Softdelete1756981536364 implements MigrationInterface {
  name = 'Softdelete1756981536364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "deletedAt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deletedAt" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedAt"`);
  }
}
