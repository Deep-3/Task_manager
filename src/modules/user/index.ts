// Types
export { type UserProps, type CreateUserDTO, type UpdateUserDTO } from "./user.type";

// Models
export { User, setupUserAssociations } from "./user.model";

// Services
export { UserServices } from "./user.service";

// Utils
export { toUserProps } from "./user.utils";

// Controllers
export { userController } from "./user.controller";
export { default as userRoutes } from "./user.routes";
