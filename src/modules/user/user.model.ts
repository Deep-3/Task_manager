import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../../config/database.js";
import { Task } from "../task/task.model.js";
import { UserRole } from "./user.type.js";

interface UserAttributes {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "role">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return "********";
            },
        },
        role: {
            type: DataTypes.ENUM(UserRole.USER, UserRole.ADMIN),
            allowNull: false,
            defaultValue: UserRole.USER,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
            {
                fields: ["role"],
            },
            {
                fields: ["createdAt"],
            },
        ],
    }
);

// Define associations
export function setupUserAssociations() {
    User.hasMany(Task, { foreignKey: "ownerId", as: "tasks" });
}
