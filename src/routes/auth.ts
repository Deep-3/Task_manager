import { Router } from "express";
import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const router: Router= Router();

router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body as { email?: string; password?: string; role?: "user" | "admin" };
        if (!email || !password) return res.status(400).json({ message: "email and password are required" });
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: "Email already registered" });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ id: `usr_${Math.random().toString(36).slice(2, 10)}${Date.now()}`, email, passwordHash, role: role === "admin" ? "admin" : "user" });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "Hello", { expiresIn: "7d" });
        return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) return res.status(400).json({ message: "email and password are required" });
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "Hello", { expiresIn: "1d" });
        return res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

export default router;

