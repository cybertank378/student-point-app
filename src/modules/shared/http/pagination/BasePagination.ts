//Files: src/modules/shared/http/pagination/BasePagination.ts

export interface BasePaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface BasePaginationResponse<T> {
    data: ReadonlyArray<T>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
