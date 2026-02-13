//Files: src/modules/auth/presentation/hooks/useAuthApi.ts
"use client";

import { useState } from "react";
import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/**
 * =====================================================
 * USER AUTH TYPE
 * =====================================================
 */
export interface UserAuth {
    accessToken: string;
    mustChangePassword: boolean;
}


export type UserRole =
    | "ADMIN"
    | "TEACHER"
    | "STUDENT"
    | "PARENT";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    role: UserRole;
    mustChangePassword: boolean;
}


/**
 * =====================================================
 * AUTH API HOOK (STATEFUL VERSION)
 * =====================================================
 * - Menyimpan state auth
 * - Menyimpan loading state
 * - Menyimpan error state
 * - Semua error sudah dalam bentuk ApiError
 */
export const useAuthApi = () => {
    /**
     * =====================================================
     * STATE MANAGEMENT
     * =====================================================
     */
    const [userAuth, setUserAuth] = useState<UserAuth[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * Reset error helper
     */
    const clearError = () => setError(null);

    /**
     * =====================================================
     * LOGIN
     * =====================================================
     */
    const login = async (payload: LoginPayload): Promise<LoginResponse> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    credentials: "include", // penting untuk cookie refresh token
                },
            );

            const data =
                await safeJson<LoginResponse>(res);

            return data;
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Login gagal",
            );

            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * REFRESH TOKEN
     * =====================================================
     */
    const refresh = async (): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            const data =
                await safeJson<{ accessToken: string }>(
                    res,
                );

            setUserAuth((prev) =>
                prev.map((u) => ({
                    ...u,
                    accessToken: data.accessToken,
                })),
            );
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Refresh failed",
            );
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * LOGOUT
     * =====================================================
     */
    const logout = async (): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                throw await parseError(res);
            }

            setUserAuth([]);
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Logout failed",
            );
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * CHANGE PASSWORD
     * =====================================================
     */
    const changePassword = async (
        oldPassword: string,
        newPassword: string,
    ): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });

            if (!res.ok) {
                throw await parseError(res);
            }
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Change password failed",
            );
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * REQUEST RESET PASSWORD
     * =====================================================
     */
    const requestResetPassword = async (
        username: string,
    ): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/auth/request-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (!res.ok) {
                throw await parseError(res);
            }
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Request reset failed",
            );
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    /**
     * =====================================================
     * RESET PASSWORD
     * =====================================================
     */
    const resetPassword = async (
        token: string,
        newPassword: string,
    ): Promise<void> => {
        setLoading(true);
        clearError();

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            if (!res.ok) {
                throw await parseError(res);
            }
        } catch (err: unknown) {
            const apiError = toApiError(
                err,
                "Reset password failed",
            );
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);
        }
    };

    return {
        userAuth,
        loading,
        error,
        clearError,
        login,
        refresh,
        logout,
        changePassword,
        requestResetPassword,
        resetPassword,
    };
};

