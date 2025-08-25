import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../../config/database.js";

interface UserAttributes {
    id: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "role">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public email!: string;
    public passwordHash!: string;
    public role!: "user" | "admin";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
    }
);

// Define associations
export function setupUserAssociations() {
    const { Task } = require("../task/task.model.js");
    User.hasMany(Task, { foreignKey: "ownerId", as: "tasks" });
}
