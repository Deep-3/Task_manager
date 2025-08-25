// Entities
export { UserEntity, type UserProps } from "./user.entity.js";

// Models
export { User, setupUserAssociations } from "./user.model.js";

// Repository
export { type UserRepository, type CreateUserDTO, type UpdateUserDTO } from "./user.repository.js";
export { SequelizeUserRepository } from "./sequelize-user.repository.js";

// Use Cases
export { CreateUserUseCase } from "./create-user.usecase.js";
export { ListUsersUseCase } from "./list-users.usecase.js";
export { AuthUseCase, type AuthResult } from "./auth.usecase.js";

// Controller & Routes
export { userController } from "./user.controller.js";
export { default as userRoutes } from "./user.routes.js";
