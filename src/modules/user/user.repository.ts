import { type UserEntity } from "./user.entity.js";

export interface CreateUserDTO {
    id: string;
    email: string;
    passwordHash: string;
    role?: "user" | "admin";
}

export interface UpdateUserDTO {
    email?: string;
    passwordHash?: string;
    role?: "user" | "admin";
}

export interface UserRepository {
    create(input: CreateUserDTO): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    listAll(): Promise<UserEntity[]>;
    update(id: string, input: UpdateUserDTO): Promise<UserEntity | null>;
    delete(id: string): Promise<boolean>;
}
