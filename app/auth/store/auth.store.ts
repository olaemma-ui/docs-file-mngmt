import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IHttpClient } from "@/core/client/http.client";
import { AuthService } from "../service/auth.service";
import { AxiosHttpClient } from "@/core/client/axios.client";
import { UserEntity } from "@/app/users/entities/user.entity";
import { LoginDTO } from "../dto/auth.dto";
import { CookieManager } from "@/lib/cookies/cookie-manager";
import { CookieKeys } from "@/lib/cookies/cookies.enums";
    
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
    login: (payload: LoginDTO) => Promise<void>;
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

            login: async (payload: LoginDTO) => {
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

                } else {
                    set({ error: res.message || "Login failed" });
                }
                set({ loading: false });
            },

            logout: async () => {
                set({ loading: true });
                await authService.logout();
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
            name: "auth-storage", // key for persistence
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
