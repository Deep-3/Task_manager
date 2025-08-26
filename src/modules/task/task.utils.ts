import { TaskEntity } from "./task.entity";
import { Task } from "./task.model";
import { TaskStatus } from "./task-status";

export function toTaskEntity(model: Task): TaskEntity {
    return new TaskEntity({
        id: model.id,
        title: model.title,
        description: model.description ?? null,
        status: model.status as TaskStatus,
        ownerId: model.ownerId,
        createdAt: model.createdAt!,
        updatedAt: model.updatedAt!,
    });
}
