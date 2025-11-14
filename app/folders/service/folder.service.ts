import { IHttpClient } from "@/core/client/http.client"; import { Result } from "../../../core/client/result";
import { UserEntity } from "@/app/admin/users/entities/user.entity";
import { FolderEntity } from "../entities/folder.entity";
import { CreateFolderDTO } from "../dto/create-folder.dto";


export class FolderService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    /**
     * This method return all folders of a user
     * @param parentId 
     * @returns 
     */
    async listMyFolders(parentId?: string | null): Promise<Result<FolderEntity[]>> {
        const url = parentId ? `/folders/me?parentId=${encodeURIComponent(parentId)}` : "/folders/me";
        return this.http.get({ url });
    }

    /**
     * This method returns all folders in the system
     * @param parentId 
     * @returns 
     */
    async listAllFolders(parentId?: string | null): Promise<Result<FolderEntity[]>> {
        const url = parentId ? `/folders?parentId=${encodeURIComponent(parentId)}` : "/folders";
        return this.http.get({ url });
    }

    async getFolder(id: string): Promise<Result<FolderEntity>> {
        return this.http.get({ url: `/folders/${id}` });
    }

    async createFolder(payload: CreateFolderDTO): Promise<Result<FolderEntity>> {
        return this.http.post({ url: "/folders/create", data: payload });
    }

    async renameFolder(folderId: string, payload: Partial<CreateFolderDTO & Record<string, any>>): Promise<Result<FolderEntity>> {
        return this.http.patch({ url: `/folders/rename?folderId=${folderId}`, data: payload });
    }

    async deleteFolder(id: string): Promise<Result<null>> {
        return this.http.delete({ url: `/folders/${id}` });
    }

    async moveFolder(id: string, newParentId: string | null): Promise<Result<FolderEntity>> {
        return this.http.post({ url: `/folders/${id}/move`, data: { parentId: newParentId } });
    }
}
