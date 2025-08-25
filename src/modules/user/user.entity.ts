export interface UserProps {
    id: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity {
    readonly id: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.passwordHash = props.passwordHash;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
