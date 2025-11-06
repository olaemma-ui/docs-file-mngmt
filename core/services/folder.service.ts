import { IHttpClient } from "@/core/client/http.client"; import { Result } from "../client/result";

export interface Folder {
    id: string;
    name: string;
    parentId?: string | null;
    documentCount?: number;
    [key: string]: any;
}

export interface CreateFolderPayload {
    name: string;
    parentId?: string | null;
}

export class FolderService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async listFolders(parentId?: string | null): Promise<Result<Folder[]>> {
        const url = parentId ? `/folders?parentId=${encodeURIComponent(parentId)}` : "/folders";
        return this.http.get({ url });
    }

    async getFolder(id: string): Promise<Result<Folder>> {
        return this.http.get({ url: `/folders/${id}` });
    }

    async createFolder(payload: CreateFolderPayload): Promise<Result<Folder>> {
        return this.http.post({ url: "/folders", data: payload });
    }

    async updateFolder(id: string, payload: Partial<CreateFolderPayload & Record<string, any>>): Promise<Result<Folder>> {
        return this.http.patch({ url: `/folders/${id}`, data: payload });
    }

    async deleteFolder(id: string): Promise<Result<null>> {
        return this.http.delete({ url: `/folders/${id}` });
    }

    async moveFolder(id: string, newParentId: string | null): Promise<Result<Folder>> {
        return this.http.post({ url: `/folders/${id}/move`, data: { parentId: newParentId } });
    }
}
