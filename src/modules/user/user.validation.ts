import { z } from "zod";
import { UserRole } from "./user.type";
import { USER_MESSAGES } from "./user.constant";

// Password validation regex - at least 8 chars with uppercase, lowercase, number, and special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const createUserSchema = z.object({
    email: z.string().min(1, USER_MESSAGES.ERROR.USER_EMAIL_REQUIRED).email(USER_MESSAGES.ERROR.INVALID_EMAIL_FORMAT),
    password: z
        .string()
        .min(8, USER_MESSAGES.ERROR.PASSWORD_MIN_LENGTH)
        .regex(passwordRegex, USER_MESSAGES.ERROR.PASSWORD_INVALID),
    role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

export const loginUserSchema = z.object({
    email: z.string().min(1, USER_MESSAGES.ERROR.USER_EMAIL_REQUIRED).email(USER_MESSAGES.ERROR.INVALID_EMAIL_FORMAT),
    password: z.string().min(1, USER_MESSAGES.ERROR.USER_PASSWORD_REQUIRED),
});

export const updateUserSchema = z.object({
    email: z.string().email(USER_MESSAGES.ERROR.INVALID_EMAIL_FORMAT).optional(),
    password: z
        .string()
        .min(8, USER_MESSAGES.ERROR.PASSWORD_MIN_LENGTH)
        .regex(passwordRegex, USER_MESSAGES.ERROR.PASSWORD_INVALID)
        .optional(),
    role: z.nativeEnum(UserRole).optional(),
});

// Export types for use in controllers
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
