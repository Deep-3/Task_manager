import { type TaskRepository } from "../../domain/task/TaskRepository.js";

export class ListTasksUseCase {
    constructor(private readonly repo: TaskRepository) {}

    async forOwner(ownerId: string) {
        return this.repo.listByOwner(ownerId);
    }

    async all() {
        return this.repo.listAll();
    }
}



