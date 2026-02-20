//Files: src/modules/violation/presentation/hooks/useViolationApi.ts
import { useCallback, useState } from "react";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type {
    BasePaginationParams,
    BasePaginationResponse,
} from "@/modules/shared/http/pagination/BasePagination";

import {
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/* ============================================================
   PAYLOAD TYPES
============================================================ */

/**
 * Payload used when creating a violation.
 *
 * NOTE:
 * - `level` is not included.
 * - Level is calculated in backend domain rule.
 */
export type CreateViolationPayload = {
    name: string;
    point: number;
};

/**
 * Payload used when updating violation.
 * All fields optional (ID provided separately).
 */
export type UpdateViolationPayload = {
    name?: string;
    point?: number;
};

/* ============================================================
   RETURN CONTRACT
============================================================ */

/**
 * Public contract returned by useViolationApi hook.
 */
export interface UseViolationApiReturn {
    /** Current list of violations (always mutable array for React usage) */
    violations: Violation[];

    /** Pagination metadata returned by backend */
    pagination: BasePaginationResponse<Violation> | null;

    /** Loading indicator for async operations */
    loading: boolean;

    /** Human readable error message */
    error: string | null;

    /**
     * Fetch paginated violations from backend.
     */
    fetchViolations: (
        params?: BasePaginationParams,
    ) => Promise<void>;

    /**
     * Create new violation.
     *
     * @throws ApiError when request fails.
     */
    createViolation: (
        payload: CreateViolationPayload,
    ) => Promise<Violation>;

    /**
     * Update violation by ID.
     *
     * @throws ApiError when request fails.
     */
    updateViolation: (
        id: string,
        payload: UpdateViolationPayload,
    ) => Promise<Violation>;

    /**
     * Delete violation by ID.
     *
     * @throws ApiError when request fails.
     */
    deleteViolation: (id: string) => Promise<void>;
}

/* ============================================================
   HOOK IMPLEMENTATION
============================================================ */

/**
 * ============================================================
 * useViolationApi
 * ============================================================
 *
 * HTTP adapter hook for Violation module.
 *
 * Responsibilities:
 * - Handle HTTP communication with /api/violations
 * - Maintain paginated state
 * - Convert HTTP errors into ApiError
 * - Ensure frontend receives mutable arrays
 *
 * Architecture:
 * - Uses safeJson() for parsing
 * - Uses toApiError() for error normalization
 * - Fully aligned with HttpResultHandler
 *
 * Important:
 * Backend returns readonly arrays.
 * We clone them into mutable arrays before
 * assigning into React state.
 *
 * This hook contains NO business logic.
 * ============================================================
 */
export function useViolationApi(): UseViolationApiReturn {
    /* ================= STATE ================= */

    const [violations, setViolations] =
        useState<Violation[]>([]);

    const [pagination, setPagination] =
        useState<BasePaginationResponse<Violation> | null>(
            null,
        );

    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    /* ============================================================
       FETCH PAGINATED LIST
    ============================================================ */

    const fetchViolations = useCallback(
        async (
            params?: BasePaginationParams,
        ): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const query = new URLSearchParams();

                if (params?.page) {
                    query.append("page", String(params.page));
                }

                if (params?.limit) {
                    query.append("limit", String(params.limit));
                }

                if (params?.search) {
                    query.append("search", params.search);
                }

                if (params?.sortBy) {
                    query.append("sortBy", params.sortBy);
                }

                if (params?.sortOrder) {
                    query.append(
                        "sortOrder",
                        params.sortOrder,
                    );
                }

                const response = await fetch(
                    `/api/violations-master?${query.toString()}`,
                );

                /**
                 * safeJson:
                 * - Throws ApiError if response is not 2xx
                 * - Returns parsed JSON otherwise
                 */
                const result =
                    await safeJson<
                        BasePaginationResponse<Violation>
                    >(response);

                /**
                 * IMPORTANT:
                 * result.data is readonly Violation[].
                 * We clone it to mutable array before
                 * assigning to React state.
                 */
                setViolations([...result.data]);
                setPagination(result);
            } catch (err: unknown) {
                const apiError = toApiError(
                    err,
                    "Gagal mengambil data pelanggaran.",
                );

                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /* ============================================================
       CREATE
    ============================================================ */

    const createViolation = async (
        payload: CreateViolationPayload,
    ): Promise<Violation> => {
        try {
            const response = await fetch(
                "/api/violations-master",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            return await safeJson<Violation>(
                response,
            );
        } catch (err: unknown) {
            throw toApiError(
                err,
                "Gagal membuat pelanggaran.",
            );
        }
    };

    /* ============================================================
       UPDATE
    ============================================================ */

    const updateViolation = async (
        id: string,
        payload: UpdateViolationPayload,
    ): Promise<Violation> => {
        try {
            const response = await fetch(
                `/api/violations-master/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            return await safeJson<Violation>(
                response,
            );
        } catch (err: unknown) {
            throw toApiError(
                err,
                "Gagal memperbarui pelanggaran.",
            );
        }
    };

    /* ============================================================
       DELETE
    ============================================================ */

    const deleteViolation = async (
        id: string,
    ): Promise<void> => {
        try {
            const response = await fetch(
                `/api/violations-master/${id}`,
                {
                    method: "DELETE",
                },
            );

            await safeJson<void>(response);
        } catch (err: unknown) {
            throw toApiError(
                err,
                "Gagal menghapus pelanggaran.",
            );
        }
    };

    return {
        violations,
        pagination,
        loading,
        error,
        fetchViolations,
        createViolation,
        updateViolation,
        deleteViolation,
    };
}