import { type UserRepository } from "./user.repository.js";

export class ListUsersUseCase {
    constructor(private readonly repo: UserRepository) {}

    async execute() {
        return this.repo.listAll();
    }
}
