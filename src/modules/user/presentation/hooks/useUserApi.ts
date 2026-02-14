//Files: src/modules/user/presentation/hooks/useUserApi.ts

import {useState} from "react";
import type {User} from "@/modules/user/domain/entity/User";
import {type ApiError, safeJson, toApiError, parseError} from "@/modules/shared/errors/ApiError";

/**
 * =====================================================
 * USER API HOOK
 * =====================================================
 * - Menggunakan safeJson untuk parsing sukses
 * - Menggunakan parseError untuk HTTP error
 * - Menggunakan toApiError untuk unknown/network error
 * - Tidak ada business logic
 */

export const useUserApi = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] =
        useState<boolean>(false);
    const [error, setError] =
        useState<ApiError | null>(null);

    const clearError = () => setError(null);

    /**
     * =====================================================
     * LIST USERS
     * GET /api/users
     * =====================================================
     */
    const getAll = async (): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/users");

            const data = await safeJson<User[]>(res);

            setUsers(data);
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Failed to fetch users",
            );

            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * CREATE USER
     * POST /api/users
     * =====================================================
     */
    const create = async (payload: {
        username: string;
        password: string;
        role: string;
    }): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await safeJson<User>(res);

            setUsers((prev) => [...prev, data]);
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Failed to create user",
            );

            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * UPDATE USER
     * PUT /api/users/:id
     * =====================================================
     */
    const update = async (
        id: string,
        payload: {
            username?: string;
            role?: string;
            isActive?: boolean;
        },
    ): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch(
                `/api/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            const updated = await safeJson<User>(res);

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id ? updated : u,
                ),
            );
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Failed to update user",
            );

            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * DELETE USER
     * DELETE /api/users/:id
     * =====================================================
     */
    const remove = async (
        id: string,
    ): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch(
                `/api/users/${id}`,
                { method: "DELETE" },
            );

            if (!res.ok) {
                await parseError(res);
            }

            setUsers((prev) =>
                prev.filter((u) => u.id !== id),
            );
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Failed to delete user",
            );

            setError(apiError);

            // ❌ Jangan throw lagi di UI hook
        } finally {
            setLoading(false);
        }
    };


    return {
        users,
        loading,
        error,
        clearError,
        getAll,
        create,
        update,
        remove,
    };
};