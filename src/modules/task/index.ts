// Entities
export { TaskEntity, type TaskProps } from "./task.entity.js";
export { type TaskStatus } from "./task-status.js";

// Models
export { Task, setupTaskAssociations } from "./task.model.js";

// Repository
export { type TaskRepository, type CreateTaskDTO, type UpdateTaskDTO } from "./task.repository.js";
export { SequelizeTaskRepository } from "./sequelize-task.repository.js";

// Use Cases
export { CreateTaskUseCase } from "./create-task.usecase.js";
export { ListTasksUseCase } from "./list-tasks.usecase.js";
export { GetTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase } from "./get-update-delete-task.usecase.js";

// Controller & Routes
export { tasksController } from "./task.controller.js";
export { default as taskRoutes } from "./task.routes.js";
