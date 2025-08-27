import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ResponseHandler } from "../utils/response-handler";
import { APP_MESSAGES } from "../constants/http-constants";

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: "user" | "admin" } & JwtPayload;
}
interface UserPayload {
    id: string;
    email: string;
    role: "user" | "admin";
}
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    if (!token) return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.TOKEN_REQUIRED);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & UserPayload;
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch {
        return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.INVALID_TOKEN);
    }
}

export function requireRole(role: "user" | "admin") {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.UNAUTHORIZED);
        console.log(req.user.role);
        if (req.user.role !== role) return ResponseHandler.forbidden(res, APP_MESSAGES.ERROR.ACCESS_DENIED);
        next();
    };
}
