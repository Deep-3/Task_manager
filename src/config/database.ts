import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


export const sequelize = new Sequelize(`postgres://postgres:password@localhost:5432/task_manage`, {
    logging: false,
  });

export async function connectDatabase() {
    await sequelize.authenticate();
}

