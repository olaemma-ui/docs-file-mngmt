import { UserEntity } from "@/app/admin/users/entities/user.entity";

export interface FolderEntity {
    id: string;
    name: string;
    parentId?: string | null;
    filesCount?: number;
    owner: UserEntity;
    createdAt: Date
}