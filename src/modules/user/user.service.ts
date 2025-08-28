import { User } from "./user.model";
import { UserProps, UserRole, CreateUserDTO, UpdateUserDTO } from "./user.type";
import { toUserProps } from "./user.utils";
import { USER_MESSAGES } from "./user.constant";
export class UserServices {
    private userModel: typeof User;

    constructor(userModel: typeof User) {
        this.userModel = userModel;
    }

    async create(input: CreateUserDTO): Promise<UserProps> {
        const created = await this.userModel.create({
            email: input.email,
            password: input.password,
            role: input.role ?? UserRole.USER,
        });
        return toUserProps(created);
    }

    async findByEmail(email: string): Promise<UserProps | null> {
        const user = await this.userModel.findOne({
            where: { email },
        });

        if (!user) {
            return null;
        }

        return toUserProps(user);
    }

    async findById(id: string): Promise<UserProps | null> {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            return null;
        }
        return toUserProps(user);
    }

    async listAll(): Promise<UserProps[]> {
        const users = await this.userModel.findAll();
        return users.map(toUserProps);
    }

    async update(id: string, input: UpdateUserDTO): Promise<UserProps> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new Error(USER_MESSAGES.ERROR.USER_NOT_FOUND);
        }

        Object.assign(user, input);
        await user.save();
        return toUserProps(user);
    }

    async delete(id: string): Promise<boolean> {
        const count = await this.userModel.destroy({ where: { id } });
        return count > 0;
    }
}
