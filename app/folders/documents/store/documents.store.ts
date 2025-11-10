"use client";

import { create } from "zustand";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { IHttpClient } from "@/core/client/http.client";
import {
    DocumentsMeta,
    DocumentsService,
    UploadResult,
} from "../service/documents.service";

// Initialize HttpClient
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
);

// Initialize the DocumentsService
const documentsService = new DocumentsService(httpClient);

export interface UploadingFile extends DocumentsMeta {
    progress: number;
}

interface DocumentsStore {
    files: DocumentsMeta[];
    searchResult: DocumentsMeta[];
    currentFile: DocumentsMeta | null;
    loading: boolean;
    uploading: boolean;
    error: string | null;
    uploadingFiles: UploadingFile[];

    // Actions
    searchFiles: (
        folderId?: string,
        query?: {
            folderId?: string;
            uploaderId?: string;
            pageNumber?: 1;
            pageSize?: 10;
            sortBy?: string;
            sortOrder?: "ASC" | "DESC";
            mimeType?: string;
            keyWord?: string;
            dateFrom?: string;
            dateTo?: string;
        }
    ) => Promise<void>;
    listFiles: (folderId?: string) => Promise<void>;
    getFile: (id: string) => Promise<void>;
    uploadFile: (
        formData: FormData,
        onProgress?: (percent: number, fileId: string) => void
    ) => Promise<UploadResult | null>;
    deleteFile: (id: string) => Promise<void>;
    updateFileMetadata: (
        id: string,
        payload: Partial<DocumentsMeta>
    ) => Promise<void>;
    setCurrentFile: (file: DocumentsMeta | null) => void;
    setUploadingFiles: (files: UploadingFile[]) => void;
}

export const useDocumentsStore = create<DocumentsStore>((set, get) => ({
    files: [],
    searchResult: [],
    currentFile: null,
    loading: false,
    uploading: false,
    error: null,
    uploadingFiles: [],

    setUploadingFiles: (files: UploadingFile[]) => set({ uploadingFiles: files }),

    searchFiles: async (folderId, query) => {
        set({ loading: true, error: null });
        try {
            const result = await documentsService.listFiles(folderId, query);
            if (!result.hasError) {
                set({ searchResult: result.data || [] });
            } else {
                set({ error: result.message || "Failed to load files" });
            }
        } catch (err: any) {
            set({ error: err.message || "An unexpected error occurred" });
        } finally {
            set({ loading: false });
        }
    },

    listFiles: async (folderId) => {
        set({ loading: true, error: null });
        try {
            const result = await documentsService.listFiles(folderId);
            if (!result.hasError) {
                set({ files: result.data || [] });
            } else {
                set({ error: result.message || "Failed to load files" });
            }
        } catch (err: any) {
            set({ error: err.message || "An unexpected error occurred" });
        } finally {
            set({ loading: false });
        }
    },

    getFile: async (id) => {
        set({ loading: true, error: null });
        try {
            const result = await documentsService.getFile(id);
            if (!result.hasError) {
                set({ currentFile: result.data });
            } else {
                set({ error: result.message || "Failed to fetch file" });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    uploadFile: async (formData, onProgress) => {
        set({ uploading: true, error: null });

        // Generate a temporary id for tracking
        const tempId = Math.random().toString(36).substr(2, 9);
        const fileName = formData.get("fileName") as string;

        // Add temporary uploading file to the store
        set((state) => ({
            uploadingFiles: [
                ...state.uploadingFiles,
                { id: tempId, name: fileName, progress: 0 } as UploadingFile,
            ],
        }));

        try {
            const result = await documentsService.uploadFile(formData, {}, (progress) => {

                // Update progress in store
                set((state) => ({
                    uploadingFiles: state.uploadingFiles.map((f) =>
                        f.id === tempId ? { ...f, progress } : f
                    ),
                }));
                // Call optional callback
                onProgress?.(progress, tempId);
            });

            if (!result.hasError) {
                // Replace temporary uploading file with real file data
                set((state) => ({
                    files: [...state.files, result.data as DocumentsMeta],
                    uploadingFiles: state.uploadingFiles.filter((f) => f.id !== tempId),
                }));
                return result.data;
            } else {
                set({ error: result.message || "Failed to upload file" });
                return null;
            }
        } catch (err: any) {
            set({ error: err.message });
            return null;
        } finally {
            set({ uploading: false });
        }
    },

    deleteFile: async (id) => {
        set({ loading: true, error: null });
        try {
            const result = await documentsService.deleteFile(id);
            if (!result.hasError) {
                set({ files: get().files.filter((file) => file.id !== id) });
            } else {
                set({ error: result.message || "Failed to delete file" });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    updateFileMetadata: async (id, payload) => {
        set({ loading: true, error: null });
        try {
            const result = await documentsService.updateFileMetadata(id, payload);
            if (!result.hasError) {
                set({
                    files: get().files.map((file) =>
                        file.id === id ? { ...file, ...payload } : file
                    ),
                });
            } else {
                set({ error: result.message || "Failed to update file metadata" });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    setCurrentFile: (file) => set({ currentFile: file }),
}));
