import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ResponseHandler } from "../utils/response-handler";
import { APP_MESSAGES } from "../constants/http-constants";
import { UserRole } from "../modules/user/user.type";
import { UserPayload } from "../constants/type.constant";

export interface AuthRequest extends Request {
    user?: UserPayload & JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    if (!token) return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.TOKEN_REQUIRED);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as AnyType) as JwtPayload & UserPayload;
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch {
        return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.INVALID_TOKEN);
    }
}

export function requireRole(role: UserRole) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return ResponseHandler.unauthorized(res, APP_MESSAGES.ERROR.UNAUTHORIZED);
        if (req.user.role !== role) return ResponseHandler.forbidden(res, APP_MESSAGES.ERROR.ACCESS_DENIED);
        next();
    };
}
