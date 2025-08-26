import { UserEntity } from "./user.entity";
import { User } from "./user.model";

export function toEntity(model: User): UserEntity {
    return new UserEntity({
        id: model.id,
        email: model.email,
        password: model.password,
        role: model.role,
        createdAt: model.createdAt!,
        updatedAt: model.updatedAt!,
    });
}
