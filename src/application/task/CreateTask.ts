import { type TaskRepository, type CreateTaskDTO } from "../../domain/task/TaskRepository.js";
import { TaskEntity } from "../../domain/task/Task.js";

export class CreateTaskUseCase {
    constructor(private readonly repo: TaskRepository) {}

    async execute(input: CreateTaskDTO): Promise<TaskEntity> {
        const payload = { ...input, status: input.status ?? "todo" };
        return this.repo.create(payload);
    }
}


