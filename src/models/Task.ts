import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/database.js";

interface TaskAttributes {
    id: string;
    title: string;
    description?: string | null;
    status: "todo" | "in_progress" | "done";
    ownerId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type TaskCreationAttributes = Optional<TaskAttributes, "id" | "description" | "status">;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public title!: string;
    public description!: string | null;
    public status!: "todo" | "in_progress" | "done";
    public ownerId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: { type: DataTypes.STRING, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: { type: DataTypes.ENUM("todo", "in_progress", "done"), allowNull: false, defaultValue: "todo" },
        ownerId: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        modelName: "Task",
        tableName: "tasks",
    }
);

