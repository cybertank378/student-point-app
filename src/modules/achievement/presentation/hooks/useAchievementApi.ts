//Files: src/modules/achievement/presentation/hooks/useAchievementApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";
import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";
import {usePaginatedApi} from "@/modules/shared/pagination/usePaginatedApi";
import {StudentAchievement} from "@/generated/prisma";

/**
 * Hook: Achievement Master API
 * Endpoint: /api/achievements-master
 */
export const useAchievementApi = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * ============================
     * FETCH ALL
     * ============================
     */
    const fetchAchievements = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);

            const res = await fetch("/api/achievements-master");
            const list = await safeJson<Achievement[]>(res);

            setAchievements(list ?? []);
        } catch (err) {
            const apiErr = toApiError(
                err,
                "Failed to fetch achievements",
            );
            setError(apiErr);
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const api = usePaginatedApi<StudentAchievement, {
        studentId: string;
        page: number;
        limit: number;
    }>({
        endpoint: "/api/student-achievements",
    });

    /**
     * ============================
     * GET BY ID
     * ============================
     */
    const getAchievementById = useCallback(
        async (
            id: string | null | undefined,
        ): Promise<Achievement | null> => {
            if (!id) {
                console.warn(
                    "getAchievementById called without id",
                );
                return null;
            }

            try {
                setError(null);

                const res = await fetch(
                    `/api/achievements-master/${id}`,
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const achievement =
                    await safeJson<Achievement>(res);

                return achievement ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to fetch achievement",
                );
                setError(apiErr);
                return null;
            }
        },
        [],
    );

    /**
     * ============================
     * CREATE
     * ============================
     */
    const createAchievement = useCallback(
        async (
            payload: CreateAchievementDTO,
        ): Promise<Achievement | null> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/achievements-master",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    },
                );

                const created =
                    await safeJson<Achievement>(res);

                await fetchAchievements();
                return created ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to create achievement",
                );
                setError(apiErr);
                console.error(
                    "createAchievement error",
                    err,
                );
                return null;
            }
        },
        [fetchAchievements],
    );

    /**
     * ============================
     * UPDATE
     * ============================
     */
    const updateAchievement = useCallback(
        async (
            payload: UpdateAchievementDTO,
        ): Promise<Achievement | null> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/achievements-master/${payload.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    },
                );

                const updated =
                    await safeJson<Achievement>(res);

                await fetchAchievements();
                return updated ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to update achievement",
                );
                setError(apiErr);
                console.error(
                    "updateAchievement error",
                    err,
                );
                return null;
            }
        },
        [fetchAchievements],
    );

    /**
     * ============================
     * DELETE (SOFT)
     * ============================
     */
    const deleteAchievement = useCallback(
        async (id: string): Promise<void> => {
            if (!id) return;

            try {
                setError(null);

                const res = await fetch(
                    `/api/achievements-master/${id}`,
                    {
                        method: "DELETE",
                    },
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    console.error(
                        "deleteAchievement failed",
                        apiErr,
                    );
                }

                await fetchAchievements();
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to delete achievement",
                );
                setError(apiErr);
                console.error(
                    "deleteAchievement error",
                    err,
                );
            }
        },
        [fetchAchievements],
    );

    /**
     * ============================
     * INITIAL LOAD
     * ============================
     */
    useEffect(() => {
        fetchAchievements().catch(console.error);
    }, [fetchAchievements]);

    return {
        achievements,
        loading,
        error, // error?.statusCode / error?.code bisa dipakai UI
        fetchAchievements,
        getAchievementById,
        createAchievement,
        updateAchievement,
        deleteAchievement,
    };
};
