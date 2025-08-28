import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { User } from "../user/user.model";
import { TaskStatus } from "./task.type";

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
        id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: {
            type: DataTypes.ENUM(TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE),
            allowNull: false,
            defaultValue: TaskStatus.TODO,
        },
        ownerId: { type: DataTypes.UUIDV4, allowNull: false },
    },
    {
        sequelize,
        modelName: "Task",
        tableName: "tasks",
        indexes: [
            {
                fields: ["ownerId"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["ownerId", "title"],
            },
            {
                fields: ["ownerId", "status"],
            },
            {
                fields: ["ownerId", "createdAt"],
            },
        ],
    }
);

// Define associations
export function setupTaskAssociations() {
    Task.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
}
