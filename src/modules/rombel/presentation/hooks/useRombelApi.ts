//Files: src/modules/rombel/presentation/hooks/useRombelApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

export const useRombelApi = () => {
    const [rombels, setRombels] = useState<Rombel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchRombels = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);

            const res = await fetch("/api/rombels");
            const data = await safeJson<Rombel[]>(res);

            setRombels(data ?? []);
        } catch (err) {
            setError(toApiError(err, "Failed to fetch rombels"));
            setRombels([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createRombel = useCallback(
        async (payload: CreateRombelDTO): Promise<Rombel | null> => {
            try {
                setError(null);

                const res = await fetch("/api/rombels", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const created = await safeJson<Rombel>(res);
                await fetchRombels();
                return created ?? null;
            } catch (err) {
                setError(toApiError(err, "Failed to create rombel"));
                return null;
            }
        },
        [fetchRombels],
    );

    const updateRombel = useCallback(
        async (payload: UpdateRombelDTO): Promise<Rombel | null> => {
            try {
                setError(null);

                const res = await fetch(`/api/rombels/${payload.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const updated = await safeJson<Rombel>(res);
                await fetchRombels();
                return updated ?? null;
            } catch (err) {
                setError(toApiError(err, "Failed to update rombel"));
                return null;
            }
        },
        [fetchRombels],
    );

    const deleteRombel = useCallback(
        async (id: string) => {
            try {
                setError(null);

                const res = await fetch(`/api/rombels/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    setError(await parseError(res));
                }

                await fetchRombels();
            } catch (err) {
                setError(toApiError(err, "Failed to delete rombel"));
            }
        },
        [fetchRombels],
    );

    useEffect(() => {
        fetchRombels();
    }, [fetchRombels]);

    return {
        rombels,
        loading,
        error,
        fetchRombels,
        createRombel,
        updateRombel,
        deleteRombel,
    };
};
