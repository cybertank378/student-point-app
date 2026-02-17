"use client";

import {useCallback, useEffect, useState} from "react";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";

import {
    type ApiError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";
import {serverLog} from "@/libs/serverLogger";

interface ListResponse {
    data: UserEntity[];
    total: number;
    page: number;
    limit: number;
}

interface ListParams {
    page?: number;
    limit?: number;
    search?: string;
}

/**
 * 🔥 ADVANCED SEARCH PARAMS (B-Tree Optimized)
 */
interface SearchParams {
    page?: number;
    limit?: number;
    username?: string;
    role?: string;
    isActive?: boolean;
    teacherRole?: string;
    createdFrom?: string;
    createdTo?: string;
    sortBy?: "createdAt" | "username";
    sortOrder?: "asc" | "desc";
}

interface UserStats {
    totalActiveUsers: number;
    totalAdmin: number;
    totalStudentUsers: number;
    totalParentUsers: number;
    totalTeacherUsers: number;
}

export function useUserApi(autoFetch = false) {
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * ================= BASIC LIST =================
     */


    const list = useCallback(async (params?: ListParams) => {
        try {
            const query = new URLSearchParams({
                page: String(params?.page ?? 1),
                limit: String(params?.limit ?? 10),
                ...(params?.search && {search: params.search}),
            });

            const res = await fetch(`/api/users?${query.toString()}`);
            const data = await safeJson<ListResponse>(res);

            setUsers(data.data);
            return data;
        } catch (err) {
            const apiError = toApiError(err, "Gagal mengambil data user.");
            setError(apiError);
            return null;
        }
    }, []);

    /**
     * ================= 🔥 ADVANCED SEARCH =================
     * Menggunakan endpoint: /api/users/search
     */
    const searchUsers = useCallback(async (params?: SearchParams) => {
        try {
            const query = new URLSearchParams({
                page: String(params?.page ?? 1),
                limit: String(params?.limit ?? 10),
                ...(params?.username && {username: params.username}),
                ...(params?.role && {role: params.role}),
                ...(params?.isActive !== undefined && {
                    isActive: String(params.isActive),
                }),
                ...(params?.teacherRole && {
                    teacherRole: params.teacherRole,
                }),
                ...(params?.createdFrom && {
                    createdFrom: params.createdFrom,
                }),
                ...(params?.createdTo && {
                    createdTo: params.createdTo,
                }),
                ...(params?.sortBy && {sortBy: params.sortBy}),
                ...(params?.sortOrder && {sortOrder: params.sortOrder}),
            });

            const res = await fetch(`/api/users/search?${query.toString()}`);
            const data = await safeJson<ListResponse>(res);

            setUsers(data.data);
            return data;
        } catch (err) {
            const apiError = toApiError(
                err,
                "Gagal melakukan pencarian user."
            );
            setError(apiError);
            return null;
        }
    }, []);

    /**
     * ================= USER STATS =================
     */
    const getStats = useCallback(async () => {
        try {
            const res = await fetch("/api/users/stats");
            const data = await safeJson<UserStats>(res);

            setStats(data);
            return data;
        } catch (err) {
            const apiError = toApiError(
                err,
                "Gagal mengambil statistik user."
            );
            setError(apiError);
            return null;
        }
    }, []);

    /**
     * ================= CREATE =================
     */
    const create = useCallback(async (payload: unknown) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            const newUser = await safeJson<UserEntity>(res);

            setUsers((prev) => [newUser, ...prev]);
            return newUser;
        } catch (err) {
            const apiError = toApiError(err, "Gagal membuat user.");
            setError(apiError);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ================= UPDATE =================
     */
    const update = useCallback(async (
        id: string,
        payload: {
            password?: string;
            role: string;
            teacherRole?: string | null;
            image?: string | null;
            isActive: boolean;
        }
    ): Promise<{
        data: UserEntity | null;
        error: ApiError | null;
    }> => {


        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            const updatedUser = await safeJson<UserEntity>(res);

            console.log("UPDATED USER FROM API:", updatedUser);

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? updatedUser : u))
            );

            return { data: updatedUser, error: null};
        } catch (err) {
            const apiError = toApiError( err,"Gagal memperbarui user." );

            setError(apiError);

            return { data: null, error: apiError };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ================= DELETE =================
     */
    const remove = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });

            await safeJson(res);
            setUsers((prev) => prev.filter((u) => u.id !== id));

            return true;
        } catch (err) {
            const apiError = toApiError(err, "Gagal menghapus user.");
            setError(apiError);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ================= GET BY ID =================
     */
    const getById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/users/${id}`);
            const user = await safeJson<UserEntity>(res);

            return user;
        } catch (err) {
            const apiError = toApiError(err, "Gagal mengambil detail user.");
            setError(apiError);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ================= UPLOAD USER IMAGE =================
     * Endpoint:
     *   POST /api/users/:id/upload
     *
     * - Upload avatar user tertentu
     * - Mengembalikan fileName
     * - Otomatis update user.image di state
     */
    const uploadUserImage = useCallback(
        async (
            id: string,
            file: File
        ): Promise<{
            data: { fileName: string } | null;
            error: ApiError | null;
        }> => {
            setLoading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`/api/users/${id}/upload`, {
                    method: "POST",
                    body: formData,
                });

                const result = await safeJson<{ fileName: string }>(res);


                // ❌ JANGAN update state users di sini

                return {
                    data: result,
                    error: null,
                };
            } catch (err) {
                const apiError = toApiError(
                    err,
                    "Gagal mengupload foto user."
                );

                setError(apiError);

                return {
                    data: null,
                    error: apiError,
                };
            } finally {
                setLoading(false);
            }
        },
        []
    );



    /**
     * ================= INITIAL FETCH =================
     */
    useEffect(() => {
        if (!autoFetch) return;

        let mounted = true;

        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([list(), getStats()]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void init();

        return () => {
            mounted = false;
        };
    }, [autoFetch]);

    return {
        users,
        stats,
        loading,
        error,
        list,
        searchUsers, // 🔥 added
        create,
        update,
        remove,
        getStats,
        uploadUserImage,
    };
}
