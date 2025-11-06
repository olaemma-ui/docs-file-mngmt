import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

import { IHttpClient } from "./http.client";
import { Result } from "./result";

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
                const token = localStorage.getItem('auth_token');
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
     */
    private handleError<T>(error: AxiosError): Result<T> {
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
        { url, data, config }:
            {
                url: string,
                data?: FormData | Record<string, any>,
                config?: AxiosRequestConfig
            }): Promise<Result<T>> {
        try {
            // 🔹 Automatically switch header to multipart/form-data when sending FormData
            const headers =
                data instanceof FormData
                    ? { "Content-Type": "multipart/form-data" }
                    : { "Content-Type": "application/json" };

            const response = await this.axiosInstance.post(url, data, {
                ...config,
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
