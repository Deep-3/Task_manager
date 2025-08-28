import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import { userController } from "./modules/user/index.js";
import { tasksController } from "./modules/task/index.js";
import { authMiddleware, requireRole } from "./middleware/auth.js";
import { setupAssociations } from "./modules/associations.js";
import { setupSwagger } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import { logger } from "./constants/winston.js";
import { UserRole } from "./modules/user/user.type.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Setup Swagger documentation
setupSwagger(app);

app.use("/auth", userController);

app.use("/tasks", authMiddleware, tasksController);
app.use("/admin", authMiddleware, requireRole(UserRole.ADMIN), userController);

const PORT = Number(process.env.PORT || 3000);

async function start() {
    try {
        await connectDatabase();

        setupAssociations();

        const { sequelize } = await import("./config/database.js");
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();
