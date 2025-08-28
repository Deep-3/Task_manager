import { UserProps } from "./user.type";
import { User } from "./user.model";

export function toUserProps(model: User): UserProps {
    return {
        id: model.id,
        email: model.email,
        password: model.getDataValue("password"),
        role: model.role,
        createdAt: model.createdAt!,
        updatedAt: model.updatedAt!,
    };
}
