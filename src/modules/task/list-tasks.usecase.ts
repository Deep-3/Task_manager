import { type TaskRepository } from "./task.repository.js";

export class ListTasksUseCase {
    constructor(private readonly repo: TaskRepository) {}

    async forOwner(ownerId: string) {
        return this.repo.listByOwner(ownerId);
    }

    async all() {
        return this.repo.listAll();
    }
}
