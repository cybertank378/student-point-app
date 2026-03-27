// Files: src/modules/student-violation/presentation/hooks/useStudentViolationApi.ts
"use client";

/**
 * ============================================================
 * USE STUDENT VIOLATION API
 * ============================================================
 *
 * Frontend API Adapter untuk modul Student Violation.
 *
 * Hook ini bertindak sebagai lapisan komunikasi antara
 * komponen UI React dengan endpoint API Student Violation.
 *
 * Responsibilities:
 * - Memanggil endpoint API student violation
 * - Mengelola state data pelanggaran siswa
 * - Menangani loading state
 * - Menormalisasi error menggunakan ApiError helpers
 * - Menjaga sinkronisasi UI state
 *
 * Architecture Flow:
 *
 * UI Component
 *      │
 *      ▼
 * useStudentViolationApi
 *      │
 *      ▼
 * /api/students/:id/violation
 *      │
 *      ▼
 * Controller → Service → UseCase → Repository → Database
 */

import { useCallback, useState } from "react";


import type { RecordViolationDTO }
    from "@/modules/student-violation/domain/dto/RecordViolationDTO";

import type { ResolveViolationDTO }
    from "@/modules/student-violation/domain/dto/ResolveViolationDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";
import {StudentViolation} from "@/modules/student-violation/domain/entity/StudentViolation";

/**
 * ============================================================
 * HOOK
 * ============================================================
 *
 * Hook utama untuk mengakses API Student Violation.
 *
 * State yang disediakan:
 *
 * - violations → daftar pelanggaran siswa
 * - loading → status request API
 * - error → error API dalam bentuk ApiError
 *
 * Method yang tersedia:
 *
 * - listViolations()
 * - recordViolation()
 * - resolveViolation()
 */

export const useStudentViolationApi = () => {

    /** State daftar pelanggaran */
    const [violations, setViolations] =
        useState<StudentViolation[]>([]);

    /** Status loading request API */
    const [loading, setLoading] =
        useState<boolean>(false);

    /** Error API yang telah dinormalisasi */
    const [error, setError] =
        useState<ApiError | null>(null);

    /**
     * ============================================================
     * LIST STUDENT VIOLATIONS
     * ============================================================
     *
     * Mengambil daftar pelanggaran siswa.
     *
     * @param studentId - ID unik siswa
     *
     * @returns Promise<StudentViolation[] | null>
     */

    const listViolations = useCallback(
        async (
            studentId: string
        ): Promise<StudentViolation[] | null> => {

            try {

                setError(null);
                setLoading(true);

                const res =
                    await fetch(
                        `/api/students/${studentId}/violation`
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const data =
                    await safeJson<StudentViolation[]>(res);

                setViolations(data);

                return data;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mengambil data pelanggaran siswa."
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
     * RECORD STUDENT VIOLATION
     * ============================================================
     *
     * Mencatat pelanggaran baru pada siswa.
     *
     * @param payload - Data pelanggaran
     *
     * @returns Promise<boolean>
     */

    const recordViolation = useCallback(
        async (
            payload: RecordViolationDTO
        ): Promise<boolean> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${payload.studentId}/violation`,
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

                    return false;

                }

                return true;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mencatat pelanggaran siswa."
                    );

                setError(apiErr);

                return false;

            }

        },
        []
    );

    /**
     * ============================================================
     * RESOLVE STUDENT VIOLATION
     * ============================================================
     *
     * Memperbarui status penyelesaian pelanggaran siswa.
     *
     * @param studentId - ID siswa
     * @param payload - Data resolusi pelanggaran
     *
     * @returns Promise<boolean>
     */

    const resolveViolation = useCallback(
        async (
            studentId: string,
            payload: ResolveViolationDTO
        ): Promise<boolean> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/violation`,
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

                    return false;

                }

                return true;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal memperbarui status pelanggaran."
                    );

                setError(apiErr);

                return false;

            }

        },
        []
    );

    return {

        violations,
        loading,
        error,

        listViolations,
        recordViolation,
        resolveViolation,

    };

};