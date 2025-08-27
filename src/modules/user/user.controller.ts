import { type Response, Router } from "express";
import { type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type AuthRequest } from "../../middleware/auth";
import { UserServices } from "./user.service";
import { User } from "./user.model";
import { ResponseHandler } from "../../utils/response-handler";
import { USER_MESSAGES } from "./user.constant";
import { UserRole } from "./user.entity";
import { HTTP_STATUS } from "../../constants/http-constants";

const userService = new UserServices(User);

export const userController: ReturnType<typeof Router> = Router();

interface BodyType {
    email?: string;
    password?: string;
    role?: UserRole;
}
// Auth routes
userController.post("/signup", async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body as BodyType;
        if (!email || !password) return ResponseHandler.badRequest(res, USER_MESSAGES.ERROR.USER_CREDENTIALS_REQUIRED);

        const exists = await userService.findByEmail(email);
        if (exists) return ResponseHandler.badRequest(res, USER_MESSAGES.ERROR.USER_ALREADY_EXISTS);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.create({
            id: `usr_${Math.random().toString(36).slice(2, 10)}${Date.now()}`,
            email,
            password: hashedPassword,
            role: role === "admin" ? UserRole.ADMIN : UserRole.USER,
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
        return ResponseHandler.created(res, {
            statuscode: HTTP_STATUS.CREATED,
            data: { user: { id: user.id, email: user.email, role: user.role } },
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

userController.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as BodyType;
        if (!email || !password) return ResponseHandler.badRequest(res, USER_MESSAGES.ERROR.USER_CREDENTIALS_REQUIRED);

        const user = await userService.findByEmail(email);
        if (!user) return ResponseHandler.unauthorized(res, USER_MESSAGES.ERROR.INVALID_CREDENTIALS);

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return ResponseHandler.unauthorized(res, USER_MESSAGES.ERROR.INVALID_CREDENTIALS);

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
        return ResponseHandler.success(res, {
            statuscode: HTTP_STATUS.OK,
            data: { user: { id: user.id, email: user.email, role: user.role } },
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

userController.post("/logout", (_req: AuthRequest, res: Response) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date() });
    return ResponseHandler.success(res, {
        statuscode: HTTP_STATUS.OK,
        message: USER_MESSAGES.INFO.USER_LOGOUT_SUCCESS,
    });
});

// Admin routes
userController.get("/users", async (_req: AuthRequest, res: Response) => {
    try {
        const users = await userService.listAll();
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { users } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});
