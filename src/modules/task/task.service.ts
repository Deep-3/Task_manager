import { Task } from "./task.model.js";
import { TaskEntity } from "./task.entity.js";
import { type CreateTaskDTO, type UpdateTaskDTO } from "./task.repository.js";
import { TaskStatus } from "./task-status.js";
import { toTaskEntity } from "./task.utils.js";
import { Task_MESSAGES } from "./task.constant.js";
import { Op, Sequelize } from "sequelize";
export interface PaginatedTaskResponse {
    rows: TaskEntity[];
    page: number;
}
export class TaskServices {
    private taskModel: typeof Task;

    constructor(taskModel: typeof Task) {
        this.taskModel = taskModel;
    }
    async create(input: CreateTaskDTO): Promise<TaskEntity> {
        const created = await this.taskModel.create({
            id: input.id,
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? TaskStatus.TODO,
            ownerId: input.ownerId,
        });
        return toTaskEntity(created);
    }

    async listByOwner(
        ownerId: string,
        page: number = 1,
        limit: number = 10,
        search: string
    ): Promise<PaginatedTaskResponse> {
        const offset = (page - 1) * limit;
        const list = await this.taskModel.findAndCountAll({
            where: {
                ownerId,
                [Op.or]: [
                    Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
                        [Op.like]: `%${search.toLowerCase()}%`,
                    }),
                    Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
                        [Op.like]: `%${search.toLowerCase()}%`,
                    }),
                ],
            },
            limit,
            offset,
        });
        return {
            rows: list.rows.map(toTaskEntity),
            page: page,
        };
    }

    async listAll(page: number = 1, limit: number = 10, search: string): Promise<PaginatedTaskResponse> {
        const offset = (page - 1) * limit;
        console.log("limit", limit);
        const list = await this.taskModel.findAndCountAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
                        [Op.like]: `%${search.toLowerCase()}%`,
                    }),
                    Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
                        [Op.like]: `%${search.toLowerCase()}%`,
                    }),
                ],
            },
            limit,
            offset,
        });

        return {
            rows: list.rows.map(toTaskEntity),
            page: page,
        };
    }

    async getById(id: string): Promise<TaskEntity | null> {
        const found = await this.taskModel.findByPk(id);
        if (!found) {
            throw new Error(Task_MESSAGES.Error.TASK_NOT_FOUND);
        }
        return toTaskEntity(found);
    }

    async update(id: string, input: UpdateTaskDTO): Promise<TaskEntity> {
        const found = await this.taskModel.findByPk(id);
        if (!found) {
            throw new Error(Task_MESSAGES.Error.TASK_NOT_FOUND);
        }
        Object.assign(found, input);
        await found.save();
        return toTaskEntity(found);
    }

    async delete(id: Array<string>): Promise<boolean> {
        const count = await this.taskModel.destroy({ where: { id } });
        return count > 0;
    }
}
