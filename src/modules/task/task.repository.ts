import { type TaskEntity } from "./task.entity.js";
import { type TaskStatus } from "./task-status.js";

export interface CreateTaskDTO {
    id: string;
    title: string;
    description?: string | null;
    status?: TaskStatus;
    ownerId: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
}

export interface TaskRepository {
    create(input: CreateTaskDTO): Promise<TaskEntity>;
    listByOwner(ownerId: string): Promise<TaskEntity[]>;
    listAll(): Promise<TaskEntity[]>;
    getById(id: string): Promise<TaskEntity | null>;
    update(id: string, input: UpdateTaskDTO): Promise<TaskEntity | null>;
    delete(id: string): Promise<boolean>;
}
