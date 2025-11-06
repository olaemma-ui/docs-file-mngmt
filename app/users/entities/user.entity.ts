import { AccountStatus, UserRoles } from "@/core/enums/users.enums";



export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role?: UserRoles;
    status?: AccountStatus;
}