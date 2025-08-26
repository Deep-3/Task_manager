import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { User } from "../user/user.model";
import { TaskStatus } from "./task-status";

interface TaskAttributes {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    ownerId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type TaskCreationAttributes = Optional<TaskAttributes, "id" | "description" | "status">;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public title!: string;
    public description!: string | null;
    public status!: TaskStatus;
    public ownerId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: { type: DataTypes.STRING, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: {
            type: DataTypes.ENUM(TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE),
            allowNull: false,
            defaultValue: TaskStatus.TODO,
        },
        ownerId: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        modelName: "Task",
        tableName: "tasks",
    }
);

// Define associations
export function setupTaskAssociations() {
    Task.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
}
