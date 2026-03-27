//Files: src/modules/achievement/presentation/hooks/useAchievementApi.ts
"use client";

import {useCallback, useEffect, useState} from "react";

import type {Achievement} from "@/modules/achievement/domain/entity/Achievement";
import type {CreateAchievementDTO} from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type {UpdateAchievementDTO} from "@/modules/achievement/domain/dto/UpdateAchievementDTO";

import {type ApiError, parseError, safeJson, toApiError,} from "@/modules/shared/errors/ApiError";
import type {BasePaginationParams, BasePaginationResponse} from "@/modules/shared/http/pagination/BasePagination";
import {buildPaginationQuery} from "@/libs/utils";

/**
 * Hook: Achievement Master API
 * Endpoint: /api/achievements-master
 */
export const useAchievementApi = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [pagination, setPagination] = useState<BasePaginationResponse<Achievement> | null>(null,);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * ============================
     * FETCH ALL
     * ============================
     */
    const fetchAchievements = useCallback(
        async (params?: BasePaginationParams): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const query = buildPaginationQuery(params);

                const response = await fetch(
                    `/api/achievements-master${query ? `?${query}` : ""}`
                );

                const result =
                    await safeJson<
                        BasePaginationResponse<Achievement>
                    >(response);

                setAchievements([...result.data]);
                setPagination(result);

            } catch (err: unknown) {
                const apiError = toApiError(
                    err,
                    "Gagal mengambil data achievement."
                );

                setError(apiError);
                setAchievements([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * ============================
     * GET BY ID
     * ============================
     */
    const getAchievementById = useCallback(
        async (id: string | null | undefined): Promise<Achievement | null> => {
            if (!id) {
                console.warn("getAchievementById called without id");
                return null;
            }

            try {
                setError(null);

                const res = await fetch(`/api/achievements-master/${id}`);

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const achievement = await safeJson<Achievement>(res);

                return achievement ?? null;
            } catch (err) {
                const apiErr = toApiError(err, "Failed to fetch achievement");
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
        async (payload: CreateAchievementDTO): Promise<Achievement | null> => {
            try {
                setError(null);

                const res = await fetch("/api/achievements-master", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const created = await safeJson<Achievement>(res);

                await fetchAchievements();
                return created ?? null;
            } catch (err) {
                const apiErr = toApiError(err, "Failed to create achievement");
                setError(apiErr);
                console.error("createAchievement error", err);
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
        async (payload: UpdateAchievementDTO): Promise<Achievement | null> => {
            try {
                setError(null);

                const res = await fetch(`/api/achievements-master/${payload.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const updated = await safeJson<Achievement>(res);

                await fetchAchievements();
                return updated ?? null;
            } catch (err) {
                const apiErr = toApiError(err, "Failed to update achievement");
                setError(apiErr);
                console.error("updateAchievement error", err);
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

                const res = await fetch(`/api/achievements-master/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    console.error("deleteAchievement failed", apiErr);
                    return;
                }

                await fetchAchievements();
            } catch (err) {
                const apiErr = toApiError(err, "Failed to delete achievement");
                setError(apiErr);
                console.error("deleteAchievement error", err);
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
        void fetchAchievements();
    }, [fetchAchievements]);

    return {
        achievements,
        loading,
        pagination,
        error,
        fetchAchievements,
        getAchievementById,
        createAchievement,
        updateAchievement,
        deleteAchievement,
    };
};
