import { AccountStatus, UserRoles } from "@/core/enums/users.enums";



export interface UserEntity {
    id: string;
    fullName: string;
    email: string;
    role?: UserRoles;
    status?: AccountStatus;
}