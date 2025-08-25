import { type UserRepository } from "./user.repository.js";
import { UserEntity } from "./user.entity.js";

export interface AuthResult {
    user: UserEntity;
    token: string;
}

export class AuthUseCase {
    constructor(private readonly repo: UserRepository) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.repo.findByEmail(email);
    }
}
