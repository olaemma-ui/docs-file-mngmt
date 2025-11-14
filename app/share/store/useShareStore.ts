"use client";

import { create } from "zustand";
import { ShareEntity } from "../entities/share.entity";
import { IHttpClient } from "@/core/client/http.client";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { Result } from "@/core/client/result";
import { ShareService } from "../service/share.service";
import { SharePayload } from "../dto/share.dto";

// Initialize HttpClient
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
);

const shareService = new ShareService(httpClient);

interface ShareState {
    shares: ShareEntity[];
    sharing: boolean;
    unsharing: boolean;
    error?: string | null;

    shareResource: (payload: SharePayload) => Promise<Result<null> | undefined>;
    unshareResource: (payload: { resourceId: string; users: string[]; teams: string[] }) => Promise<Result<null> | undefined>;
    getFileShares: (fileId: string) => Promise<void>;
    getFolderShares: (folderId: string) => Promise<void>;
}

export const useShareStore = create<ShareState>((set) => ({
    shares: [],
    sharing: false,
    unsharing: false,
    error: null,

    async shareResource(payload) {
        set({ sharing: true, error: null });
        try {
            const result = await shareService.shareResource(payload);
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ sharing: false });
        }
    },

    async unshareResource(payload) {
        set({ unsharing: true, error: null });
        try {
            const result = await shareService.unshareResource(payload);
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ unsharing: false });
        }
    },

    async getFileShares(fileId) {
        set({ sharing: true, error: null });
        try {
            const result = await shareService.getFileShares(fileId);
            if (!result.hasError && result.data) set({ shares: result.data });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ sharing: false });
        }
    },

    async getFolderShares(folderId) {
        set({ sharing: true, error: null });
        try {
            const result = await shareService.getFolderShares(folderId);
            if (!result.hasError && result.data) set({ shares: result.data });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ sharing: false });
        }
    },
}));
