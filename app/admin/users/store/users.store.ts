"use client";

import { create } from "zustand";
import { IHttpClient } from "@/core/client/http.client";
import { Result } from "@/core/client/result";
import { UserEntity } from "../entities/user.entity";
import { CreateUserPayload } from "../dto/create-user.dto";
import { UserService } from "../service/user.service";
import { AxiosHttpClient } from "@/core/client/axios.client";

// Initialize HttpClient
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
);

const userService = new UserService(httpClient);

interface UsersState {
    users: UserEntity[];
    selectedUser?: UserEntity | null;
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error?: string | null;

    listUsers: (query?: Record<string, any>) => Promise<void>;
    listUsersCreatedByAdmin: (query?: Record<string, any>) => Promise<void>;
    getUser: (id: string) => Promise<void>;
    createUser: (payload: CreateUserPayload) => Promise<Result<UserEntity> | undefined>;
    updateUser: (id: string, payload: Partial<CreateUserPayload & Record<string, any>>) => Promise<Result<UserEntity> | undefined>;
    deleteUser: (id: string) => Promise<Result<null> | undefined>;
    assignRole: (id: string, role: string) => Promise<Result<UserEntity> | undefined>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    selectedUser: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,

    async listUsers(query) {
        set({ loading: true, error: null });
        try {
            const result = await userService.listUsers(query);
            if (!result.hasError && result.data) {
                set({ users: result.data });
            } else {
                set({ error: result.message });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },
    
    async listUsersCreatedByAdmin(query) {
        set({ loading: true, error: null });
        try {
            const result = await userService.listUsers(query);
            if (!result.hasError && result.data) {
                set({ users: result.data });
            } else {
                set({ error: result.message });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    async getUser(id) {
        set({ loading: true, error: null });
        try {
            const result = await userService.getUser(id);
            if (!result.hasError && result.data) {
                set({ selectedUser: result.data });
            } else {
                set({ error: result.message });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    async createUser(payload) {
        set({ creating: true, error: null });
        try {
            const result = await userService.createUser(payload);
            if (!result.hasError && result.data) {
                set((state) => ({ users: [result.data!, ...state.users] }));
            } else {
                set({ error: result.message });
            }
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ creating: false });
        }
    },

    async updateUser(id, payload) {
        set({ updating: true, error: null });
        try {
            const result = await userService.updateUser(id, payload);
            if (!result.hasError && result.data) {
                set((state) => ({
                    users: state.users.map((u) => (u.id === id ? result.data! : u)),
                    selectedUser: result.data,
                }));
            } else {
                set({ error: result.message });
            }
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ updating: false });
        }
    },

    async deleteUser(id) {
        set({ deleting: true, error: null });
        try {
            const result = await userService.deleteUser(id);
            if (!result.hasError) {
                set((state) => ({
                    users: state.users.filter((u) => u.id !== id),
                }));
            } else {
                set({ error: result.message });
            }
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ deleting: false });
        }
    },

    async assignRole(id, role) {
        set({ updating: true, error: null });
        try {
            const result = await userService.assignRole(id, role);
            if (!result.hasError && result.data) {
                set((state) => ({
                    users: state.users.map((u) => (u.id === id ? result.data! : u)),
                }));
            } else {
                set({ error: result.message });
            }
            return result;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ updating: false });
        }
    },
}));
