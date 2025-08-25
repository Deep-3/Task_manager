import { type TaskRepository, type CreateTaskDTO } from "./task.repository.js";
import { TaskEntity } from "./task.entity.js";

export class CreateTaskUseCase {
    constructor(private readonly repo: TaskRepository) {}

    async execute(input: CreateTaskDTO): Promise<TaskEntity> {
        const payload = { ...input, status: input.status ?? "todo" };
        return this.repo.create(payload);
    }
}
