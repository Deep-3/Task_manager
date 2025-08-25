import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { type Response } from "express";
import { User } from "../models/index.js";
import { type AuthRequest } from "../middleware/auth.js";

const router: ExpressRouter = Router();

router.get("/users", async (_req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({ attributes: ["id", "email", "role", "createdAt"] });
        return res.json({ users });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

export default router;

