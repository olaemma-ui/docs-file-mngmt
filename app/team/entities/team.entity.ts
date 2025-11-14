import { UserEntity } from "@/app/admin/users/entities/user.entity";

export interface TeamEntity {
    id: string;
    name: string;
    description?: string;
    creator: UserEntity;
    members?: Array<{
        id: string;
        user: UserEntity;
        role: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
}
