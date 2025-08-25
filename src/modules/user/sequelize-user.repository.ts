import { User } from "./user.model.js";
import { UserEntity } from "./user.entity.js";
import { type UserRepository, type CreateUserDTO, type UpdateUserDTO } from "./user.repository.js";

function toEntity(model: User): UserEntity {
    return new UserEntity({
        id: model.id,
        email: model.email,
        passwordHash: model.passwordHash,
        role: model.role,
        createdAt: model.createdAt!,
        updatedAt: model.updatedAt!,
    });
}

export class SequelizeUserRepository implements UserRepository {
    async create(input: CreateUserDTO): Promise<UserEntity> {
        const created = await User.create({
            id: input.id,
            email: input.email,
            passwordHash: input.passwordHash,
            role: input.role ?? "user",
        });
        return toEntity(created);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const found = await User.findOne({ where: { email } });
        return found ? toEntity(found) : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const found = await User.findByPk(id);
        return found ? toEntity(found) : null;
    }

    async listAll(): Promise<UserEntity[]> {
        const list = await User.findAll();
        return list.map(toEntity);
    }

    async update(id: string, input: UpdateUserDTO): Promise<UserEntity | null> {
        const found = await User.findByPk(id);
        if (!found) return null;
        if (input.email !== undefined) found.email = input.email;
        if (input.passwordHash !== undefined) found.passwordHash = input.passwordHash;
        if (input.role !== undefined) found.role = input.role;
        await found.save();
        return toEntity(found);
    }

    async delete(id: string): Promise<boolean> {
        const count = await User.destroy({ where: { id } });
        return count > 0;
    }
}
