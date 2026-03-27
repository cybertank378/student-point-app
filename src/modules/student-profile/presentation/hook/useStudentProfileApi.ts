//Files: src/modules/student-profile/presentation/hook/useStudentProfileApi.ts
"use client";

/**
 * ============================================================
 * USE STUDENT PROFILE API
 * ============================================================
 *
 * Frontend API Adapter untuk modul Student Profile.
 *
 * Hook ini bertindak sebagai lapisan komunikasi antara
 * komponen UI React dengan endpoint API Student Profile.
 *
 * Responsibilities:
 * - Memanggil endpoint API student profile
 * - Mengelola state data profil siswa
 * - Menangani loading state
 * - Menormalisasi error menggunakan ApiError helpers
 * - Menjaga sinkronisasi UI state
 *
 * Architecture Flow:
 *
 * UI Component
 *      │
 *      ▼
 * useStudentProfileApi
 *      │
 *      ▼
 * /api/students/:id/profile
 *      │
 *      ▼
 * Controller → Service → UseCase → Repository → Database
 */

import { useCallback, useState } from "react";

import type { StudentProfileDTO } from "@/modules/student-profile/domain/dto/StudentProfileDTO";
import type { UpdateStudentProfileDTO } from "@/modules/student-profile/domain/dto/UpdateStudentProfileDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/**
 * ============================================================
 * HOOK
 * ============================================================
 *
 * Hook utama untuk mengakses API Student Profile.
 *
 * State yang disediakan:
 *
 * - profile → data profil siswa
 * - loading → status request API
 * - error   → error API dalam bentuk ApiError
 *
 * Method yang tersedia:
 *
 * - getProfile()
 * - updateProfile()
 * - deleteProfile()
 */

export const useStudentProfileApi = () => {

    /** State profil siswa */
    const [profile, setProfile] =
        useState<StudentProfileDTO | null>(null);

    /** Status loading request API */
    const [loading, setLoading] =
        useState<boolean>(false);

    /** Error API yang telah dinormalisasi */
    const [error, setError] =
        useState<ApiError | null>(null);

    /**
     * ============================================================
     * GET STUDENT PROFILE
     * ============================================================
     *
     * Mengambil data profil siswa berdasarkan ID siswa.
     *
     * @param studentId - ID unik siswa
     *
     * @returns Promise<StudentProfileDTO | null>
     *
     * Return:
     * - StudentProfileDTO jika berhasil
     * - null jika request gagal
     */
    const getProfile = useCallback(
        async (studentId: string): Promise<StudentProfileDTO | null> => {

            try {

                setError(null);
                setLoading(true);

                const res =
                    await fetch(`/api/students/${studentId}/profile`);

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return null;

                }

                const data =
                    await safeJson<StudentProfileDTO>(res);

                setProfile(data);

                return data;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal mengambil profil siswa."
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
     * UPDATE STUDENT PROFILE
     * ============================================================
     *
     * Memperbarui data profil siswa.
     *
     * @param studentId - ID siswa
     * @param payload - Data profil yang akan diperbarui
     *
     * @returns Promise<StudentProfileDTO | null>
     */
    const updateProfile = useCallback(
        async (
            studentId: string,
            payload: UpdateStudentProfileDTO
        ): Promise<StudentProfileDTO | null> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/profile`,
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
                    await safeJson<StudentProfileDTO>(res);

                setProfile(updated);

                return updated;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal memperbarui profil siswa."
                    );

                setError(apiErr);

                return null;

            }

        },
        []
    );

    /**
     * ============================================================
     * DELETE STUDENT PROFILE
     * ============================================================
     *
     * Menghapus profil siswa dari sistem.
     *
     * @param studentId - ID siswa
     *
     * @returns Promise<boolean>
     *
     * Return:
     * - true jika berhasil
     * - false jika gagal
     */
    const deleteProfile = useCallback(
        async (studentId: string): Promise<boolean> => {

            try {

                setError(null);

                const res =
                    await fetch(
                        `/api/students/${studentId}/profile`,
                        {
                            method: "DELETE",
                        }
                    );

                if (!res.ok) {

                    const apiErr =
                        await parseError(res);

                    setError(apiErr);

                    return false;

                }

                setProfile(null);

                return true;

            } catch (err) {

                const apiErr =
                    toApiError(
                        err,
                        "Gagal menghapus profil siswa."
                    );

                setError(apiErr);

                return false;

            }

        },
        []
    );

    return {

        profile,
        loading,
        error,

        getProfile,
        updateProfile,
        deleteProfile,

    };

};