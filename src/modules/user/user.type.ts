export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export interface CreateUserDTO {
    email: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserDTO {
    email?: string;
    password?: string;
    role?: UserRole;
}

export interface UserProps {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
