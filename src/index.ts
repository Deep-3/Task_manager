import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import { userController } from "./modules/user/index.js";
import { tasksController } from "./modules/task/index.js";
import { authMiddleware, requireRole } from "./middleware/auth.js";
import { setupAssociations } from "./modules/associations.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
    res.json({ success: true, service: "Task Manager API" });
});

app.use("/auth", userController);

app.use("/tasks", authMiddleware, tasksController);
app.use("/admin", authMiddleware, requireRole("admin"), userController);

const PORT = Number(process.env.PORT || 3000);

async function start(): Promise<void> {
    try {
        await connectDatabase();

        setupAssociations();

        const { sequelize } = await import("./config/database.js");
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();
