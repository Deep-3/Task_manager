import { Task } from "./task.model";
import { TaskProps, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from "./task.type";
import { toTaskProps } from "./task.utils";
import { Task_MESSAGES } from "./task.constant";
import { Op, Sequelize } from "sequelize";
export interface PaginatedTaskResponse {
    rows: TaskProps[];
    page: number;
}
export class TaskServices {
    private taskModel: typeof Task;

    constructor(taskModel: typeof Task) {
        this.taskModel = taskModel;
    }
    async create(input: CreateTaskDTO): Promise<TaskProps> {
        const created = await this.taskModel.create({
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? TaskStatus.TODO,
            ownerId: input.ownerId,
        });
        return toTaskProps(created);
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
        console.log(list);
        return {
            rows: list.rows.map(toTaskProps),
            page,
        };
    }

    async listAll(page: number = 1, limit: number = 10, search: string): Promise<PaginatedTaskResponse> {
        const offset = (page - 1) * limit;
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
            rows: list.rows.map(toTaskProps),
            page,
        };
    }

    async getByTask(title: string, ownerId: string): Promise<TaskProps | null> {
        const found = await this.taskModel.findOne({ where: { title, ownerId } });
        if (found) {
            return toTaskProps(found);
        }
        return null;
    }
    async getById(id: string): Promise<TaskProps | null> {
        const found = await this.taskModel.findByPk(id);
        if (!found) {
            throw new Error(Task_MESSAGES.Error.TASK_NOT_FOUND);
        }
        return toTaskProps(found);
    }

    async update(id: string, input: UpdateTaskDTO): Promise<TaskProps> {
        const found = await this.taskModel.findByPk(id);
        if (!found) {
            throw new Error(Task_MESSAGES.Error.TASK_NOT_FOUND);
        }
        Object.assign(found, input);
        await found.save();
        return toTaskProps(found);
    }

    async delete(id: Array<string>): Promise<boolean> {
        const count = await this.taskModel.destroy({ where: { id } });
        return count > 0;
    }
}
