import { IHttpClient } from "@/core/client/http.client"; import { Result } from "../client/result";

export interface FileMeta {
    id: string;
    name: string;
    size?: number;
    mimeType?: string;
    ownerId?: string;
    folderId?: string | null;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface UploadResult {
    id: string;
    url?: string;
    [key: string]: any;
}

export class FileService {
    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async listFiles(folderId?: string, query?: Record<string, any>): Promise<Result<FileMeta[]>> {
        let url = "/files";
        const params = new URLSearchParams(query as any || {});
        if (folderId) params.set("folderId", folderId);
        const qs = params.toString();
        if (qs) url += `?${qs}`;
        return this.http.get({ url });
    }

    async getFile(id: string): Promise<Result<FileMeta>> {
        return this.http.get({ url: `/files/${id}` });
    }

    // For upload, we expect the caller to prepare FormData with file and metadata
    async uploadFile(formData: FormData, config?: any): Promise<Result<UploadResult>> {
        return this.http.post({ url: "/files/upload", data: formData, config });
    }

    async downloadFile(id: string, config?: any): Promise<Result<Blob>> {
        return this.http.get({ url: `/files/${id}/download`, config });
    }

    async updateFileMetadata(id: string, payload: Partial<FileMeta>): Promise<Result<FileMeta>> {
        return this.http.patch({ url: `/files/${id}`, data: payload });
    }

    async deleteFile(id: string): Promise<Result<null>> {
        return this.http.delete({ url: `/files/${id}` });
    }

    async shareFile(id: string, payload: { toUserId?: string; toTeamId?: string; expiresAt?: string; permissions?: string[] }): Promise<Result<null>> {
        return this.http.post({ url: `/files/${id}/share`, data: payload });
    }

    async getVersions(id: string): Promise<Result<any[]>> {
        return this.http.get({ url: `/files/${id}/versions` });
    }

    async revertToVersion(id: string, versionId: string): Promise<Result<FileMeta>> {
        return this.http.post({ url: `/files/${id}/versions/${versionId}/revert` });
    }
}
