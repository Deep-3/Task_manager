import { type TaskStatus } from "./task-status";

export interface TaskProps {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class TaskEntity {
    readonly id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    readonly ownerId: string;
    readonly createdAt: Date;
    updatedAt: Date;

    constructor(props: TaskProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description ?? null;
        this.status = props.status;
        this.ownerId = props.ownerId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
