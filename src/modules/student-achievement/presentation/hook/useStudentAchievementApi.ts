// Files: src/modules/student-achievement/presentation/hook/useStudentAchievementApi.ts

"use client";

/**
 * ============================================================
 * USE STUDENT ACHIEVEMENT API HOOK
 * ============================================================
 *
 * Frontend API Adapter untuk modul Student Achievement.
 *
 * Modul ini menangani komunikasi antara UI React
 * dengan endpoint achievement siswa.
 *
 * Responsibilities:
 * - Mengambil daftar achievement siswa
 * - Mengambil detail achievement siswa
 * - Menambahkan achievement siswa
 * - Menghapus achievement siswa
 * - Mengelola loading state
 * - Menormalisasi error API menggunakan ApiError helpers
 *
 * Architecture Flow:
 *
 * UI Component
 *      │
 *      ▼
 * useStudentAchievementApi
 *      │
 *      ▼
 * /api/students/:id/achievements
 *      │
 *      ▼
 * Controller → Service → UseCase → Repository → Database
 */

import { useCallback, useState } from "react";

import type { StudentAchievement }
    from "@/modules/student-achievement/domain/entity/StudentAchievement";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError
} from "@/modules/shared/errors/ApiError";

/* ============================================================
 * HOOK
 * ============================================================ */

export const useStudentAchievementApi = () => {

    /** Daftar achievement siswa */
    const [achievements, setAchievements] =
        useState<StudentAchievement[]>([]);

    /** Detail achievement */
    const [achievement, setAchievement] =
        useState<StudentAchievement | null>(null);

    /** Status loading request */
    const [loading, setLoading] =
        useState<boolean>(false);

    /** Error API yang sudah dinormalisasi */
    const [error, setError] =
        useState<ApiError | null>(null);

    /**
     * ============================================================
     * LIST STUDENT ACHIEVEMENTS
     * ============================================================
     *
     * Mengambil seluruh achievement milik siswa.
     *
     * Endpoint:
     * GET /api/students/:id/achievements
     */

    const listStudentAchievements = useCallback(
        async (
            studentId: string
        ): Promise<StudentAchievement[] | null> => {

            try {

                setError(null);
                setLoading(true);

                const res =
                    await fetch(
                        `/api/students/${studentId}/achievements`
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const data =
                    await safeJson<StudentAchievement[]>(res);

                setAchievements(data);

                return data;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mengambil daftar achievement siswa."
                    );

                setError(apiErr);

                return null;

            } finally {

                setLoading(false);

            }

        },
        []
    );

    /**
     * ============================================================
     * GET STUDENT ACHIEVEMENT
     * ============================================================
     *
     * Mengambil detail achievement siswa.
     *
     * Endpoint:
     * GET /api/students/:id/achievements/:achievementId
     */

    const getStudentAchievement = useCallback(
        async (
            studentId: string,
            achievementId: string
        ): Promise<StudentAchievement | null> => {

            try {

                setError(null);
                setLoading(true);

                const res =
                    await fetch(
                        `/api/students/${studentId}/achievements/${achievementId}`
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const data =
                    await safeJson<StudentAchievement>(res);

                setAchievement(data);

                return data;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mengambil detail achievement siswa."
                    );

                setError(apiErr);

                return null;

            } finally {

                setLoading(false);

            }

        },
        []
    );

    /**
     * ============================================================
     * CREATE STUDENT ACHIEVEMENT
     * ============================================================
     *
     * Menambahkan achievement baru untuk siswa.
     *
     * Endpoint:
     * POST /api/students/:id/achievements
     */

    const createStudentAchievement = useCallback(
        async (
            studentId: string,
            payload: {
                achievementId: string
                point: number
                achievedAt: Date | string
            }
        ): Promise<StudentAchievement | null> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/achievements`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                        }
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const created =
                    await safeJson<StudentAchievement>(res);

                setAchievement(created);

                setAchievements(prev => [
                    ...prev,
                    created
                ]);

                return created;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal menambahkan achievement siswa."
                    );

                setError(apiErr);

                return null;

            }

        },
        []
    );

    /**
     * ============================================================
     * DELETE STUDENT ACHIEVEMENT
     * ============================================================
     *
     * Menghapus achievement siswa.
     *
     * Endpoint:
     * DELETE /api/students/:id/achievements/:achievementId
     */

    const removeStudentAchievement = useCallback(
        async (
            studentId: string,
            achievementId: string
        ): Promise<boolean> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/achievements/${achievementId}`,
                        {
                            method: "DELETE"
                        }
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return false;

                }

                setAchievements(prev =>
                    prev.filter(
                        item => item.id !== achievementId
                    )
                );

                if (achievement?.id === achievementId) {
                    setAchievement(null);
                }

                return true;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal menghapus achievement siswa."
                    );

                setError(apiErr);

                return false;

            }

        },
        [achievement]
    );

    return {

        achievements,
        achievement,
        loading,
        error,

        listStudentAchievements,
        getStudentAchievement,
        createStudentAchievement,
        removeStudentAchievement

    };

};