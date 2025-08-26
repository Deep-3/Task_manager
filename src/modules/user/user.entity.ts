export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export interface UserProps {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity {
    readonly id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.passwordHash = props.password;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
