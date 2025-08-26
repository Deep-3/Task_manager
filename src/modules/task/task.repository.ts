import { type TaskStatus } from "./task-status";

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
