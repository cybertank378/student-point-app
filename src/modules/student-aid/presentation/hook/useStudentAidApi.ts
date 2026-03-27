//Files: src/modules/student-aid/presentation/hook/useStudentAidApi.ts

"use client";

/**
 * ============================================================
 * USE STUDENT AID API HOOK
 * ============================================================
 *
 * Frontend API Adapter untuk modul Student Aid.
 *
 * Modul ini menangani komunikasi antara UI React
 * dengan endpoint bantuan siswa.
 *
 * Data bantuan siswa biasanya meliputi:
 *
 * - KJP (Kartu Jakarta Pintar)
 * - PIP (Program Indonesia Pintar)
 *
 * Responsibilities:
 * - Mengambil data bantuan siswa
 * - Menambahkan bantuan siswa
 * - Memperbarui bantuan siswa
 * - Mengelola loading state
 * - Menormalisasi error API menggunakan ApiError helpers
 *
 * Architecture Flow:
 *
 * UI Component
 *      │
 *      ▼
 * useStudentAidApi
 *      │
 *      ▼
 * /api/students/:id/aid
 *      │
 *      ▼
 * Controller → Service → UseCase → Repository → Database
 */

import { useCallback, useState } from "react";

import type { StudentAidDTO } from "@/modules/student-aid/domain/dto/StudentAidDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/* ============================================================
 * HOOK
 * ============================================================ */

/**
 * Hook utama untuk mengakses API Student Aid.
 *
 * State yang disediakan:
 *
 * - aid → data bantuan siswa
 * - loading → status request API
 * - error → error API dalam bentuk ApiError
 *
 * Method yang tersedia:
 *
 * - getStudentAid()
 * - createStudentAid()
 * - updateStudentAid()
 */

export const useStudentAidApi = () => {

    /** Data bantuan siswa */
    const [aid, setAid] =
        useState<StudentAidDTO | null>(null);

    /** Status loading request */
    const [loading, setLoading] =
        useState<boolean>(false);

    /** Error API yang sudah dinormalisasi */
    const [error, setError] =
        useState<ApiError | null>(null);

    /**
     * ============================================================
     * GET STUDENT AID
     * ============================================================
     *
     * Mengambil data bantuan siswa berdasarkan ID siswa.
     *
     * Endpoint:
     * GET /api/students/:id/aid
     *
     * @param studentId - ID unik siswa
     *
     * @returns Promise<StudentAidDTO | null>
     *
     * Return:
     * - StudentAidDTO jika berhasil
     * - null jika request gagal
     */

    const getStudentAid = useCallback(
        async (studentId: string): Promise<StudentAidDTO | null> => {

            try {

                setError(null);
                setLoading(true);

                const res =
                    await fetch(`/api/students/${studentId}/aid`);

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const data =
                    await safeJson<StudentAidDTO>(res);

                setAid(data);

                return data;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mengambil data bantuan siswa."
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
     * CREATE STUDENT AID
     * ============================================================
     *
     * Menambahkan bantuan siswa baru.
     *
     * Endpoint:
     * POST /api/students/:id/aid
     *
     * @param studentId - ID siswa
     * @param payload - Data bantuan siswa yang akan ditambahkan
     *
     * @returns Promise<StudentAidDTO | null>
     */

    const createStudentAid = useCallback(
        async (
            studentId: string,
            payload: Omit<StudentAidDTO, "id" | "studentId">
        ): Promise<StudentAidDTO | null> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/aid`,
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
                    await safeJson<StudentAidDTO>(res);

                setAid(created);

                return created;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal menambahkan bantuan siswa."
                    );

                setError(apiErr);

                return null;

            }

        },
        []
    );

    /**
     * ============================================================
     * UPDATE STUDENT AID
     * ============================================================
     *
     * Memperbarui data bantuan siswa yang sudah ada.
     *
     * Endpoint:
     * PATCH /api/students/:id/aid
     *
     * @param studentId - ID siswa
     * @param payload - Data bantuan siswa yang diperbarui
     *
     * @returns Promise<StudentAidDTO | null>
     */

    const updateStudentAid = useCallback(
        async (
            studentId: string,
            payload: StudentAidDTO
        ): Promise<StudentAidDTO | null> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/aid`,
                        {
                            method: "PATCH",
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

                const updated =
                    await safeJson<StudentAidDTO>(res);

                setAid(updated);

                return updated;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal memperbarui bantuan siswa."
                    );

                setError(apiErr);

                return null;

            }

        },
        []
    );

    return {

        aid,
        loading,
        error,

        getStudentAid,
        createStudentAid,
        updateStudentAid,

    };

};