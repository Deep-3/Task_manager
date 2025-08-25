import { type TaskRepository, type UpdateTaskDTO } from "./task.repository.js";

export class GetTaskUseCase {
    constructor(private readonly repo: TaskRepository) {}
    async byId(id: string) { return this.repo.getById(id); }
}

export class UpdateTaskUseCase {
    constructor(private readonly repo: TaskRepository) {}
    async execute(id: string, input: UpdateTaskDTO) { return this.repo.update(id, input); }
}

export class DeleteTaskUseCase {
    constructor(private readonly repo: TaskRepository) {}
    async execute(id: string) { return this.repo.delete(id); }
}
