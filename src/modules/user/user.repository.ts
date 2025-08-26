import { UserRole } from "./user.entity";

export interface CreateUserDTO {
    id: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserDTO {
    email?: string;
    password?: string;
    role?: UserRole;
}
