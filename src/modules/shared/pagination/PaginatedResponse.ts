//Files: src/modules/shared/pagination/PaginatedResponse.ts

export interface PaginatedResponse<T> {
    rows: T[];
    total: number;
}