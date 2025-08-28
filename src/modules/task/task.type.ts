export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
}

export interface TaskProps {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskDTO {
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
