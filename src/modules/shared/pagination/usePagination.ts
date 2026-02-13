//Files: src/modules/shared/pagination/usePagination.ts

"use client";

import { useCallback, useState } from "react";

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
}

export function usePagination(
    initialLimit = 10,
) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / limit);

    const reset = useCallback(() => {
        setPage(1);
        setTotal(0);
    }, []);

    return {
        page,
        limit,
        total,
        totalPages,

        setPage,
        setLimit,
        setTotal,

        reset,
    };
}
