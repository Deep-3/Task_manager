import { type Response, Router, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type AuthRequest } from "../../middleware/auth";
import { UserServices } from "./user.service";
import { User } from "./user.model";
import { ResponseHandler } from "../../utils/response-handler";
import { USER_MESSAGES } from "./user.constant";
import { UserRole } from "./user.type";
import { HTTP_STATUS } from "../../constants/http-constants";
import { validateBody } from "../../middleware/validation";
import { createUserSchema, loginUserSchema, type CreateUserInput, type LoginUserInput } from "./user.validation";
import { UserPayload } from "../../constants/type.constant";

const userService = new UserServices(User);

export const userController: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Auth routes
userController.post("/signup", validateBody(createUserSchema), async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body as CreateUserInput;

        const exists = await userService.findByEmail(email);
        if (exists) return ResponseHandler.badRequest(res, USER_MESSAGES.ERROR.USER_ALREADY_EXISTS);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.create({
            email,
            password: hashedPassword,
            role: role === "admin" ? UserRole.ADMIN : UserRole.USER,
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as AnyType, {
            expiresIn: process.env.JWT_EXPIRES_IN as AnyType,
        });

        const RefreshToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET as AnyType,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as AnyType,
            }
        );

        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
        res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return ResponseHandler.created(res, {
            statuscode: HTTP_STATUS.CREATED,
            data: { user: { id: user.id, email: user.email, role: user.role } },
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: 123e4567-e89b-12d3-a456-426614174000
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: user@example.com
 *                         role:
 *                           type: string
 *                           enum: [user, admin]
 *                           example: user
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userController.post("/login", validateBody(loginUserSchema), async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginUserInput;

        const user = await userService.findByEmail(email);
        console.log(user);
        if (!user) return ResponseHandler.unauthorized(res, USER_MESSAGES.ERROR.INVALID_CREDENTIALS);

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return ResponseHandler.unauthorized(res, USER_MESSAGES.ERROR.INVALID_CREDENTIALS);

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as AnyType, {
            expiresIn: process.env.JWT_EXPIRES_IN as AnyType,
        });
        const RefreshToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET as AnyType,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as AnyType,
            }
        );
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
        res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return ResponseHandler.success(res, {
            statuscode: HTTP_STATUS.OK,
            data: { user: { id: user.id, email: user.email, role: user.role } },
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 */
userController.post("/logout", (_req: AuthRequest, res: Response) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date() });
    return ResponseHandler.success(res, {
        statuscode: HTTP_STATUS.OK,
        message: USER_MESSAGES.INFO.USER_LOGOUT_SUCCESS,
    });
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: user
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userController.post("/refresh-token", (req: AuthRequest, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return ResponseHandler.unauthorized(res, USER_MESSAGES.ERROR.REFRESH_TOKEN_REQUIRED);
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as AnyType) as JwtPayload & UserPayload;
        console.log(decoded);
        const token = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET as AnyType,
            {
                expiresIn: process.env.JWT_EXPIRES_IN as AnyType,
            }
        );
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
        return ResponseHandler.success(res, {
            statuscode: HTTP_STATUS.OK,
            data: { user: { id: decoded.id, email: decoded.email, role: decoded.role } },
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
// Admin routes
userController.get("/users", async (req: AuthRequest, res: Response) => {
    try {
        const users = await userService.listAll();
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { users } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});
