import { User } from "./User.js";
import { Task } from "./Task.js";

// Associations
User.hasMany(Task, { foreignKey: "ownerId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

export { User, Task };


