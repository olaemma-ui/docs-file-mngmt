import { UserEntity } from "@/app/admin/users/entities/user.entity";
export interface FolderEntity {
    readonly id?: string;
    readonly name?: string;
    readonly owner?: UserEntity;
    readonly parent?: null;
    readonly shares?: Share[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly filesCount?: number;
}

export interface Share {
    readonly id?: string;
    readonly sharedBy?: Shared;
    readonly sharedWithUsers?: Shared[];
    readonly sharedWithTeams?: SharedTeam[];
    readonly access?: string;
    readonly sharedAt?: Date;
}

export interface Shared {
    readonly id?: string;
    readonly email?: string;
    readonly fullName?: string;
}
export interface SharedTeam {
    readonly id?: string;
    readonly name?: string;
}
