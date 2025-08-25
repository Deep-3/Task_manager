import { type UserRepository, type CreateUserDTO } from "./user.repository.js";
import { UserEntity } from "./user.entity.js";

export class CreateUserUseCase {
    constructor(private readonly repo: UserRepository) {}

    async execute(input: CreateUserDTO): Promise<UserEntity> {
        return this.repo.create(input);
    }
}
