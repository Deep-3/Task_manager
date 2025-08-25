import { Task } from "./task.model.js";
import { TaskEntity } from "./task.entity.js";
import { type TaskRepository, type CreateTaskDTO, type UpdateTaskDTO } from "./task.repository.js";

function toEntity(model: Task): TaskEntity {
    return new TaskEntity({
        id: model.id,
        title: model.title,
        description: model.description ?? null,
        status: model.status as any,
        ownerId: model.ownerId,
        createdAt: model.createdAt!,
        updatedAt: model.updatedAt!,
    });
}

export class SequelizeTaskRepository implements TaskRepository {
    async create(input: CreateTaskDTO): Promise<TaskEntity> {
        const created = await Task.create({
            id: input.id,
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? "todo",
            ownerId: input.ownerId,
        });
        return toEntity(created);
    }

    async listByOwner(ownerId: string): Promise<TaskEntity[]> {
        const list = await Task.findAll({ where: { ownerId } });
        return list.map(toEntity);
    }

    async listAll(): Promise<TaskEntity[]> {
        const list = await Task.findAll();
        return list.map(toEntity);
    }

    async getById(id: string): Promise<TaskEntity | null> {
        const found = await Task.findByPk(id);
        return found ? toEntity(found) : null;
    }

    async update(id: string, input: UpdateTaskDTO): Promise<TaskEntity | null> {
        const found = await Task.findByPk(id);
        if (!found) return null;
        if (input.title !== undefined) found.title = input.title;
        if (input.description !== undefined) found.description = input.description;
        if (input.status !== undefined) found.status = input.status;
        await found.save();
        return toEntity(found);
    }

    async delete(id: string): Promise<boolean> {
        const count = await Task.destroy({ where: { id } });
        return count > 0;
    }
}
