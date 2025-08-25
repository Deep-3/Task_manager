import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import "./models/index.js";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import adminRouter from "./routes/admin.js";
import { authMiddleware, requireRole } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.json({ success: true, service: "Task Manager API" });
});

// Public auth routes
app.use("/auth", authRouter);

// Protected routes
app.use("/tasks", authMiddleware, tasksRouter);
app.use("/admin", authMiddleware, requireRole("admin"), adminRouter);

const PORT = Number(process.env.PORT || 3000);

async function start() {
    try {
        await connectDatabase();
        const { sequelize } = await import("./config/database.js");
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();

