import { MigrationInterface, QueryRunner } from 'typeorm';

export class Deleterefreshtoken1757063562039 implements MigrationInterface {
  name = 'Deleterefreshtoken1757063562039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
