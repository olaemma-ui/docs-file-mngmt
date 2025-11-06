

export type Result<T> = {

    hasError: boolean,
    message: string,
    errorDetails?: Record<string, any> | null,
    data: T | null,
    metadata: {
        total: number,
        totalPages: number,
        currentPage: number,
    } | null

}