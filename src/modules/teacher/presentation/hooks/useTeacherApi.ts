"use client";

/**
 * ============================================================
 * USE TEACHER API HOOK
 * ============================================================
 *
 * Frontend API Adapter untuk modul Teacher.
 *
 * Responsibilities:
 * - Call teacher API endpoints
 * - Handle loading & error state
 * - Normalize error using ApiError helpers
 * - Keep UI state in sync
 *
 * Architecture:
 * UI → useTeacherApi → /api/teachers → Controller → Service → UseCase
 */

import { useCallback, useEffect, useState } from "react";

import type { TeacherRespDTO } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";
import type { AssignHomeroomDTO } from "@/modules/teacher/domain/dto/AssignHomeroomDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";
import {serverLog} from "@/libs/serverLogger";

/* ============================================================
 * RESPONSE TYPE
 * ============================================================ */

interface ListTeacherResponse {
    data: TeacherRespDTO[];
    total: number;
    page: number;
    limit: number;
}

/* ============================================================
 * QUERY PARAMS
 * ============================================================ */

interface ListParams {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    role?: string;
    religionCode?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

/* ============================================================
 * HOOK
 * ============================================================ */

export const useTeacherApi = (autoFetch = false) => {
    const [teachers, setTeachers] = useState<TeacherRespDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    /* ============================================================
     * INTERNAL REQUEST HANDLER (REUSABLE)
     * ============================================================ */

    const requestList = useCallback(
        async (
            endpoint: string,
            params?: ListParams
        ): Promise<ListTeacherResponse | null> => {
            try {
                setLoading(true);
                setError(null);

                const query = new URLSearchParams({
                    page: String(params?.page ?? 1),
                    limit: String(params?.limit ?? 10),
                    ...(params?.search && { search: params.search }),
                    ...(params?.name && { name: params.name }),
                    ...(params?.role && { role: params.role }),
                    ...(params?.religionCode && { religionId: params.religionCode }),
                    ...(params?.sortBy && { sortBy: params.sortBy }),
                    ...(params?.sortOrder && { sortOrder: params.sortOrder }),
                });

                const res = await fetch(
                    `/api/teachers${endpoint}?${query.toString()}`
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const data = await safeJson<ListTeacherResponse>(res);

                setTeachers(data.data);

                return data;
            } catch (err) {
                const apiError = toApiError(
                    err,
                    "Terjadi kesalahan saat mengambil data guru."
                );
                setError(apiError);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /* ============================================================
     * LIST (PAGINATION)
     * ============================================================ */

    const fetchTeachers = useCallback(
        (params?: ListParams) => requestList("", params),
        [requestList]
    );

    /* ============================================================
     * SEARCH (ADVANCED)
     * ============================================================ */

    const searchTeachers = useCallback(
        (params?: ListParams) => requestList("/search", params),
        [requestList]
    );

    /* ============================================================
     * GET BY ID
     * ============================================================ */

    const getTeacherById = useCallback(
        async (id: string): Promise<TeacherRespDTO | null> => {
            try {
                setError(null);

                const res = await fetch(`/api/teachers/${id}`);

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                return await safeJson<TeacherRespDTO>(res);
            } catch (err) {
                const apiErr = toApiError(err, "Gagal mengambil detail guru.");
                setError(apiErr);
                return null;
            }
        },
        []
    );

    /* ============================================================
     * CREATE
     * ============================================================ */

    const createTeacher = useCallback(
        async (payload: CreateTeacherDTO): Promise<TeacherRespDTO | null> => {
            try {
                setError(null);

                const res = await fetch("/api/teachers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const created = await safeJson<TeacherRespDTO>(res);

                await fetchTeachers();

                return created;
            } catch (err) {
                const apiErr = toApiError(err, "Gagal menambahkan guru.");
                setError(apiErr);
                return null;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
 * UPDATE
 * ============================================================ */

    const updateTeacher = useCallback(
        async (payload: UpdateTeacherDTO): Promise<TeacherRespDTO | null> => {
            try {
                setError(null);

                const res = await fetch(`/api/teachers/${payload.id}`, {
                    method: "PUT", // ✅ Changed from PATCH → PUT
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const updated = await safeJson<TeacherRespDTO>(res);

                await fetchTeachers();

                return updated;
            } catch (err) {
                const apiErr = toApiError(err, "Gagal mengubah data guru.");
                setError(apiErr);
                return null;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
     * DELETE
     * ============================================================ */

    const deleteTeacher = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                setError(null);

                const res = await fetch(`/api/teachers/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return false;
                }

                await fetchTeachers();
                return true;
            } catch (err) {
                const apiErr = toApiError(err, "Gagal menghapus guru.");
                setError(apiErr);
                return false;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
     * ASSIGN ROLE
     * ============================================================ */

    const assignTeacherRole = useCallback(
        async (
            payload: AssignTeacherRoleDTO
        ): Promise<TeacherRespDTO | null> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/teachers/${payload.teacherId}/roles`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ roles: payload.roles }),
                    }
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return null;
                }

                const updated = await safeJson<TeacherRespDTO>(res);

                await fetchTeachers();

                return updated;
            } catch (err) {
                const apiErr = toApiError(err, "Gagal assign role guru.");
                setError(apiErr);
                return null;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
     * ASSIGN HOMEROOM
     * ============================================================ */

    const assignHomeroom = useCallback(
        async (payload: AssignHomeroomDTO): Promise<boolean> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/teachers/${payload.teacherId}/assign-homeroom`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return false;
                }

                await fetchTeachers();
                return true;
            } catch (err) {
                const apiErr = toApiError(
                    err,
                    "Gagal menetapkan wali kelas."
                );
                setError(apiErr);
                return false;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
     * IMPORT
     * ============================================================ */

    const importTeachers = useCallback(
        async (rows: unknown): Promise<boolean> => {
            try {
                setError(null);

                const res = await fetch("/api/teachers/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(rows),
                });

                if (!res.ok) {
                    const apiErr = await parseError(res);
                    setError(apiErr);
                    return false;
                }

                await fetchTeachers();
                return true;
            } catch (err) {
                const apiErr = toApiError(err, "Gagal import guru.");
                setError(apiErr);
                return false;
            }
        },
        [fetchTeachers]
    );

    /* ============================================================
     * EXPORT
     * ============================================================ */

    const exportTeachers = useCallback(async () => {
        try {
            setError(null);

            const res = await fetch("/api/teachers/export");

            if (!res.ok) {
                const apiErr = await parseError(res);
                setError(apiErr);
                return null;
            }

            return await safeJson(res);
        } catch (err) {
            const apiErr = toApiError(err, "Gagal export guru.");
            setError(apiErr);
            return null;
        }
    }, []);

    /* ============================================================
     * AUTO FETCH
     * ============================================================ */

    useEffect(() => {
        if (!autoFetch) return;
        void fetchTeachers();
    }, [autoFetch, fetchTeachers]);

    return {
        teachers,
        loading,
        error,

        fetchTeachers,
        searchTeachers,
        getTeacherById,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        assignTeacherRole,
        assignHomeroom,
        importTeachers,
        exportTeachers,
    };
};
