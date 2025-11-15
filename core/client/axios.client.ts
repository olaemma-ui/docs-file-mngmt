import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse, AxiosProgressEvent } from "axios";

import { IHttpClient } from "./http.client";
import { Result } from "./result";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { CookieKeys, ZustandKey } from "@/lib/cookies/cookies.enums";
import { NextResponse } from "next/server";
import { CookieManager } from "@/lib/cookies/cookie-manager";

/**
 * AxiosHttpClient
 * ----------------
 * A concrete implementation of IHttpClient using Axios.
 * 
 * ✅ Handles all HTTP verbs (GET, POST, PUT, PATCH, DELETE)
 * ✅ Centralized error handling and Result normalization
 * ✅ SOLID-compliant — can easily swap Axios for another client
 * ✅ Ready for JSON and multipart/form-data uploads
 */
export class AxiosHttpClient implements IHttpClient {
    private readonly axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        // Create a reusable Axios instance with a base URL and default headers
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 10000, // ⏱️ Prevents requests from hanging forever
        });

        this.initializeInterceptors();

        // console.log()
    }

    /**
     * Initializes Axios response interceptors
     * - Keeps responses consistent
     * - Allows centralized logging or request tracking
     * - 
     */
    private initializeInterceptors() {

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = CookieManager.get({
                    name: CookieKeys.ACCESS_TOKEN
                });
                console.log({ token })
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response, // ✅ Pass normal responses through
            (error: AxiosError) => Promise.reject(error) // ❌ Let errors be handled in handleError
        );
    }

    /**
     * Normalizes successful Axios responses into a Result<T>
     */
    private handleResponse<T>(response: AxiosResponse): Result<T> {
        return {
            hasError: false,
            message: response.data?.message || "Request successful",
            errorDetails: null,
            data: response.data?.data ?? null,
            metadata: {
                total: response.data?.data?.total ?? 0,
                totalPages: response.data?.data?.totalPages ?? 0,
                currentPage: response.data?.data?.currentPage ?? 1,
            },
        };
    }

    /**
     * Normalizes failed Axios responses into a Result<T>
     * - Prevents unhandled promise rejections
     * - Ensures the consumer always gets a safe Result
     * - Redirects back to login if token expires
     */
    private handleError<T>(error: AxiosError): Result<T> {

        let authData = localStorage.getItem(ZustandKey.AUTH_DATA);

        if (
            (error.response?.status === 401 &&
                (error.response.data as any).message.toLowerCase().includes("token expired")) ||
            (error.response?.status === 404 &&
                (error.response.data as any).message.toLowerCase().includes("this user does not exist"))
            || !authData
        ) {
            // Clear local storage and cookies
            localStorage.removeItem(ZustandKey.AUTH_DATA);
            CookieManager.delete({ name: CookieKeys.ACCESS_TOKEN });

            // ✅ Redirect user to login page (frontend-safe)
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
        }

        return {
            hasError: true,
            message:
                (error.response?.data as any)?.message ||
                error.message ||
                "An unexpected error occurred.",
            errorDetails: (error.response?.data as any)?.errorDetails || error,
            data: null,
            metadata: null,
        };
    }

    //  GET — fetch data (no body)
    async get<T>({ url, config }: { url: string; config?: AxiosRequestConfig }): Promise<Result<T>> {
        try {
            const response = await this.axiosInstance.get(url, config);
            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError<T>(error as AxiosError);
        }
    }

    //  POST — send data (JSON or multipart/form-data)
    async post<T>(
        { url, data, config, onProgress }:
            {
                url: string,
                data?: FormData | Record<string, any>,
                config?: AxiosRequestConfig,
                onProgress?: (progress: number) => void;
            }): Promise<Result<T>> {
        try {
            // 🔹 Automatically switch header to multipart/form-data when sending FormData
            const headers =
                data instanceof FormData
                    ? { "Content-Type": "multipart/form-data" }
                    : { "Content-Type": "application/json" };

            const response = await this.axiosInstance.post(url, data, {
                ...config,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress?.(percentCompleted);
                    }
                },
                headers: { ...headers, ...config?.headers },
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError<T>(error as AxiosError);
        }
    }

    //  PATCH — partial update
    async patch<T>({ url, data, config }: { url: string; data?: any; config?: AxiosRequestConfig }): Promise<Result<T>> {
        try {
            const response = await this.axiosInstance.patch(url, data, config);
            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError<T>(error as AxiosError);
        }
    }

    //  PUT — full update
    async put<T>({ url, data, config }: { url: string; data?: any; config?: AxiosRequestConfig }): Promise<Result<T>> {
        try {
            const response = await this.axiosInstance.put(url, data, config);
            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError<T>(error as AxiosError);
        }
    }

    //  DELETE — remove resource
    async delete<T>({ url, config }: { url: string; config?: AxiosRequestConfig }): Promise<Result<T>> {
        try {
            const response = await this.axiosInstance.delete(url, config);
            return this.handleResponse<T>(response);
        } catch (error) {
            return this.handleError<T>(error as AxiosError);
        }
    }
}
