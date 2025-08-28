import { TaskProps, TaskStatus } from "./task.type";
import { Task } from "./task.model";

export function toTaskProps(model: Task): TaskProps {
    return {
        id: model.id,
        title: model.title,
        description: model.description ?? null,
        status: model.status as TaskStatus,
        ownerId: model.ownerId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
    };
}
