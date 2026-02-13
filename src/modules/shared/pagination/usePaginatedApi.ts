//Files: src/modules/shared/pagination/usePaginatedApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";
import type { PaginatedResponse } from "./PaginatedResponse";

interface UsePaginatedApiOptions<Q> {
    endpoint: string;
    initialQuery?: Q;
}

export function usePaginatedApi<T, Q extends Record<string, any>>(
    options: UsePaginatedApiOptions<Q>,
) {
    const { endpoint, initialQuery } = options;

    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchPage = useCallback(
        async (query: Q) => {
            setLoading(true);
            try {
                setError(null);

                const params = new URLSearchParams(
                    query as Record<string, string>,
                ).toString();

                const res = await fetch(
                    `${endpoint}?${params}`,
                );

                const data =
                    await safeJson<PaginatedResponse<T>>(res);

                setRows(data?.rows ?? []);
                setTotal(data?.total ?? 0);
            } catch (err) {
                setError(
                    toApiError(err, "Failed to fetch data"),
                );
                setRows([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        },
        [endpoint],
    );

    useEffect(() => {
        if (initialQuery) {
            fetchPage(initialQuery);
        }
    }, [fetchPage, initialQuery]);

    return {
        rows,
        total,
        loading,
        error,

        fetchPage,
    };
}
