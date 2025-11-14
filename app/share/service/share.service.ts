import { IHttpClient } from "@/core/client/http.client";
import { Result } from "@/core/client/result";
import { SharePayload } from "../dto/share.dto";


export class ShareService {

    private http: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    async shareResource(payload: SharePayload): Promise<Result<null>> {
        return this.http.post({ url: "/share", data: payload });
    }

    async unshareResource(payload: { resourceId: string; users: string[]; teams: string[] }): Promise<Result<null>> {
        return this.http.delete({ url: "/share", data: payload });
    }

    async getFileShares(fileId: string): Promise<Result<any>> {
        return this.http.get({ url: `/share/file/${fileId}` });
    }

    async getFolderShares(folderId: string): Promise<Result<any>> {
        return this.http.get({ url: `/share/folder/${folderId}` });
    }
}
