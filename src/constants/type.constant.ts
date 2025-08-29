import { UserRole } from "../modules/user/user.type";

export interface UserPayload {
    id: string;
    email: string;
    role: UserRole;
}
