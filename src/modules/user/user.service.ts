import { User } from "./user.model";
import { UserEntity, UserRole } from "./user.entity";
import { type CreateUserDTO, type UpdateUserDTO } from "./user.repository";
import { toEntity } from "./user.utils";
import { USER_MESSAGES } from "./user.constant";
export class UserServices {
    private userModel: typeof User;

    constructor(userModel: typeof User) {
        this.userModel = userModel;
    }

    async create(input: CreateUserDTO): Promise<UserEntity> {
        const created = await this.userModel.create({
            id: input.id,
            email: input.email,
            password: input.password,
            role: input.role ?? UserRole.USER,
        });
        return toEntity(created);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const found = await this.userModel.findOne({ where: { email } });
        if (!found) {
            throw new Error(USER_MESSAGES.ERROR.USER_NOT_FOUND);
        }
        return toEntity(found);
    }

    async findById(id: string): Promise<UserEntity> {
        const found = await this.userModel.findByPk(id);
        if (!found) {
            throw new Error(USER_MESSAGES.ERROR.USER_NOT_FOUND);
        }
        return toEntity(found);
    }

    async listAll(): Promise<UserEntity[]> {
        const list = await this.userModel.findAll({ attributes: { exclude: ["password", "updatedAt", "createdAt"] } });
        return list.map(toEntity);
    }

    async update(id: string, input: UpdateUserDTO): Promise<UserEntity> {
        const found = await this.userModel.findByPk(id);
        if (!found) {
            throw new Error(USER_MESSAGES.ERROR.USER_NOT_FOUND);
        }

        Object.assign(found, input);
        await found.save();
        return toEntity(found);
    }

    async delete(id: string): Promise<boolean> {
        const count = await this.userModel.destroy({ where: { id } });
        return count > 0;
    }
}
