import { create } from "zustand";
import { IHttpClient } from "@/core/client/http.client";
import { Result } from "@/core/client/result";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { CreateFolderDTO } from "../dto/create-folder.dto";
import { FolderEntity } from "../entities/folder.entity";
import { FolderService } from "../service/folder.service";
import { toast } from "sonner";

// Pass your HttpClient implementation
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ''
);
const folderService = new FolderService(httpClient);

interface FolderState {
    folders: FolderEntity[];
    currentFolder: FolderEntity | null;
    loading: boolean;
    error: string | null;

    // Actions
    listMyFolders: (parentId?: string | null) => Promise<void>;
    listAllFolders: (parentId?: string | null) => Promise<void>;
    getFolder: (id: string) => Promise<void>;
    createFolder: (payload: CreateFolderDTO) => Promise<void>;
    renameFolder: (id: string, payload: Partial<CreateFolderDTO & Record<string, any>>) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    moveFolder: (id: string, newParentId: string | null) => Promise<void>;

    setCurrentFolder: (payload: FolderEntity | null) => void;
    reset: () => void;
}

export const useFolderStore = create<FolderState>((set, get) => ({
    folders: [],
    currentFolder: null,
    loading: true,
    error: null,

    listMyFolders: async (parentId) => {
        set({ loading: true, error: null });
        const res: Result<FolderEntity[]> = await folderService.listMyFolders(parentId);
        console.log({ res })
        if (!res.hasError) set({ folders: res.data ?? [], loading: false });
        else set({ loading: false, error: res.message });
    },

    listAllFolders: async (parentId) => {
        set({ loading: true, error: null });
        const res: Result<FolderEntity[]> = await folderService.listAllFolders(parentId);
        if (!res.hasError) set({ folders: res.data ?? [], loading: false });
        else set({ loading: false, error: res.message });
    },

    getFolder: async (id) => {
        set({ loading: true, error: null });
        const res: Result<FolderEntity> = await folderService.getFolder(id);
        if (!res.hasError) set({ currentFolder: res.data, loading: false });
        else set({ loading: false, error: res.message });
    },

    createFolder: async (payload) => {
        console.log({ payload })
        set({ loading: true, error: null });
        const res: Result<FolderEntity> = await folderService.createFolder(payload);
        console.log({ res })
        if (!res.hasError) {
            toast(`Folder created successfully!`, {
                description: payload.name,
            });
            set({ folders: [res.data!, ...get().folders], loading: false });
        } else {
            toast.error(res.message);
            set({ loading: false, error: res.message });
        }
    },

    renameFolder: async (id, payload) => {
        set({ loading: true, error: null });
        const res: Result<FolderEntity> = await folderService.renameFolder(id, payload);
        if (!res.hasError) {
            toast('Folder renamed successfully!', {
                description: payload.name,
            });
            const updatedFolders = get().folders.map((f) => (f.id === id ? res.data! : f));
            set({ folders: updatedFolders, loading: false });
        } else {
            toast.error(payload.name, { description: res.message, });
            set({ loading: false, error: res.message });
        }
    },

    deleteFolder: async (id) => {
        set({ loading: true, error: null });
        const res: Result<null> = await folderService.deleteFolder(id);
        if (!res.hasError) {
            const filtered = get().folders.filter((f) => f.id !== id);
            set({ folders: filtered, loading: false });
        } else set({ loading: false, error: res.message });
    },

    moveFolder: async (id, newParentId) => {
        set({ loading: true, error: null });
        const res: Result<FolderEntity> = await folderService.moveFolder(id, newParentId);
        if (!res.hasError) {
            const updated = get().folders.map((f) => (f.id === id ? res.data! : f));
            set({ folders: updated, loading: false });
        } else set({ loading: false, error: res.message });
    },

    setCurrentFolder: (FolderEntity) => set({ currentFolder: FolderEntity }),

    reset: () => set({ folders: [], currentFolder: null, error: null }),

}));
