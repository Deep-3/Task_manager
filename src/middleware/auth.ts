import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: "user" | "admin" } & JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing Bearer token" });
    try {
        const decoded = jwt.verify(token, "Hello") as JwtPayload & {
            id: string;
            email: string;
            role: "user" | "admin";
        };
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export function requireRole(role: "user" | "admin") {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
        console.log(req.user.role);
        if (req.user.role !== role) return res.status(403).json({ message: "You can't access this resource" });
        next();
    };
}

