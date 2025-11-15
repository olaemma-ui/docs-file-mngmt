import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IHttpClient } from "@/core/client/http.client";
import { AuthService } from "../service/auth.service";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { UserEntity } from "@/app/admin/users/entities/user.entity";
import { LoginDTO, VerifyInviteDTO } from "../dto/auth.dto";
import { CookieManager } from "@/lib/cookies/cookie-manager";
import { CookieKeys, ZustandKey } from "@/lib/cookies/cookies.enums";

// 🧩 Create instance of your AuthService (you can inject http client later)
const httpClient: IHttpClient = new AxiosHttpClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || ''
);
const authService = new AuthService(httpClient);

interface AuthState {
    user: UserEntity | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    // actions
    login: (payload: LoginDTO, onSuccess: () => void) => Promise<void>;
    verifyInvite: (payload: VerifyInviteDTO) => Promise<{
        success: boolean;
        message?: string;
    }>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    setUser: (user: UserEntity | null) => void;
    setToken: (token: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            isAuthenticated: false,
            error: null,

            login: async (payload: LoginDTO, onSuccess: () => void) => {
                set({ loading: true, error: null });
                const res = await authService.login(payload);

                console.log({ res })
                if (!res.hasError && res.data) {

                    set({
                        token: res.data.accessToken,
                        user: res.data.user,
                        isAuthenticated: true,
                    });

                    const { accessToken, refreshToken } = res.data;
                    CookieManager.set({ name: CookieKeys.ACCESS_TOKEN, value: accessToken });
                    CookieManager.set({ name: CookieKeys.REFRESH_TOKEN, value: refreshToken });
                    onSuccess();

                } else {
                    set({ error: res.message || "Login failed" });
                }
                set({ loading: false });
            },

            verifyInvite: async (payload: VerifyInviteDTO) => {
                set({ loading: true, error: null });
                const res = await authService.verifyInvite(payload);

                console.log({ res })
                if (!res.hasError && res.data) {
                    return { success: true };
                } else {
                    set({ error: res.message || "Verification failed" });
                }
                set({ loading: false });
                return { success: false, message: res.message || "Verification failed" };
            },

            logout: async () => {
                set({ loading: true });
                // await authService.logout();
                CookieManager.delete({ name: CookieKeys.ACCESS_TOKEN });
                CookieManager.delete({ name: CookieKeys.REFRESH_TOKEN });

                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                });
            },

            refreshToken: async () => {
                const res = await authService.refreshToken();
                if (!res.hasError && res.data?.token) {
                    set({ token: res.data.token });
                } else {
                    set({ token: null, isAuthenticated: false });
                }
            },

            fetchCurrentUser: async () => {
                const res = await authService.getCurrentUser();
                if (!res.hasError && res.data) {
                    set({ user: res.data, isAuthenticated: true });
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            },

            setUser: (user) => set({ user }),
            setToken: (token) => set({ token, isAuthenticated: !!token }),
            clearError: () => set({ error: null }),
        }),
        {
            name: ZustandKey.AUTH_DATA, // key for persistence
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
