//Files: src/modules/academic-year/presentation/hooks/useAcademicYearApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/**
 * Hook: Academic Year API
 * Endpoint: /api/academic-years
 */
export const useAcademicYearApi = () => {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * ============================
     * FETCH ALL
     * ============================
     */
    const fetchAcademicYears = useCallback(async () => {
        setLoading(true);
        try {
            setError(null);

            const res = await fetch("/api/academic-years");
            const list = await safeJson<AcademicYear[]>(res);

            setAcademicYears(list ?? []);
        } catch (err) {
            const apiErr = toApiError(
                err,
                "Failed to fetch academic years",
            );
            setError(apiErr);
            setAcademicYears([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ============================
     * GET BY ID
     * ============================
     */
    const getAcademicYearById = useCallback(
        async (
            id: string | null | undefined,
        ): Promise<AcademicYear | null> => {
            if (!id) {
                console.warn(
                    "getAcademicYearById called without id",
                );
                return null;
            }

            try {
                setError(null);

                const res = await fetch(
                    `/api/academic-years/${id}`,
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const year =
                    await safeJson<AcademicYear>(res);

                return year ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to fetch academic year",
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
    const createAcademicYear = useCallback(
        async (
            payload: CreateAcademicYearDTO,
        ): Promise<AcademicYear | null> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/academic-years",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    },
                );

                const created =
                    await safeJson<AcademicYear>(res);

                await fetchAcademicYears();
                return created ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to create academic year",
                );
                setError(apiErr);
                console.error(
                    "createAcademicYear error",
                    err,
                );
                return null;
            }
        },
        [fetchAcademicYears],
    );

    /**
     * ============================
     * UPDATE
     * ============================
     */
    const updateAcademicYear = useCallback(
        async (
            payload: UpdateAcademicYearDTO,
        ): Promise<AcademicYear | null> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/academic-years/${payload.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: payload.name,
                        }),
                    },
                );

                const updated =
                    await safeJson<AcademicYear>(res);

                await fetchAcademicYears();
                return updated ?? null;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to update academic year",
                );
                setError(apiErr);
                console.error(
                    "updateAcademicYear error",
                    err,
                );
                return null;
            }
        },
        [fetchAcademicYears],
    );

    /**
     * ============================
     * SET ACTIVE
     * ============================
     */
    const setActiveAcademicYear = useCallback(
        async (id: string): Promise<boolean> => {
            if (!id) return false;

            try {
                setError(null);

                const res = await fetch(
                    `/api/academic-years/${id}/activate`,
                    { method: "PATCH" },
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return false;
                }

                await fetchAcademicYears();
                return true;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to activate academic year",
                );
                setError(apiErr);
                return false;
            }
        },
        [fetchAcademicYears],
    );

    /**
     * ============================
     * DELETE
     * ============================
     */
    const deleteAcademicYear = useCallback(
        async (id: string): Promise<void> => {
            if (!id) return;

            try {
                setError(null);

                const res = await fetch(
                    `/api/academic-years/${id}`,
                    { method: "DELETE" },
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    console.error(
                        "deleteAcademicYear failed",
                        apiErr,
                    );
                }

                await fetchAcademicYears();
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Failed to delete academic year",
                );
                setError(apiErr);
                console.error(
                    "deleteAcademicYear error",
                    err,
                );
            }
        },
        [fetchAcademicYears],
    );

    /**
     * ============================
     * INITIAL LOAD
     * ============================
     */
    useEffect(() => {
        fetchAcademicYears().catch(console.error);
    }, [fetchAcademicYears]);

    return {
        academicYears,
        loading,
        error, // error?.statusCode bisa dipakai di UI
        fetchAcademicYears,
        getAcademicYearById,
        createAcademicYear,
        updateAcademicYear,
        setActiveAcademicYear,
        deleteAcademicYear,
    };
};
