
import { Result } from "./result";


/**
 * Minimal, HttpRequest Config for options.
 * This avoids importing AxiosRequestConfig or any HTTP library dependency.
 */
export interface HttpRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    timeout?: number;
}

/**
 * Contract for any HTTP client (Axios, Fetch, etc.)
 * Returns a Result<T> wrapped in a Promise.
 */
export interface IHttpClient {

    get<T>(
        { url, config }:
            {
                url: string;
                config?: HttpRequestConfig,
            }
    ): Promise<Result<T>>;

    post<T>(
        { url, data, config, onProgress }:
            {
                url: string;
                data?: FormData | Record<string, any>;
                config?: HttpRequestConfig,
                onProgress?: (progress: number) => void;
            }
    ): Promise<Result<T>>;

    put<T>(
        { url, data, config }:
            {
                url: string;
                data?: any;
                config?: HttpRequestConfig
            }
    ): Promise<Result<T>>;

    patch<T>(
        { url, data, config }:
            {
                url: string;
                data?: any;
                config?: HttpRequestConfig
            }
    ): Promise<Result<T>>;

    delete<T>(
        { url, config }:
            { url: string; config?: HttpRequestConfig }
    ): Promise<Result<T>>;
}
