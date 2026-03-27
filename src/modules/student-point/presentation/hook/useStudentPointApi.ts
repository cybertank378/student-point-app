"use client";

import { useState } from "react";

import { StudentPointDTO }
    from "@/modules/student-point/domain/dto/StudentPointDTO";

/**
 * ============================================================
 * USE STUDENT POINT API
 * ============================================================
 *
 * Frontend API Adapter untuk modul Student Point.
 *
 * Responsibilities:
 *
 * - Memanggil endpoint API student point
 * - Mengelola state student point
 * - Mengelola state loading
 * - Mengelola error handling
 *
 * Endpoints:
 *
 * GET  /api/students/:id/points/:academicYearId
 * GET  /api/students/points/:academicYearId
 * POST /api/students/:id/points/recalculate
 */

export function useStudentPointApi() {

    const [studentPoint, setStudentPoint] =
        useState<StudentPointDTO | StudentPointDTO[] | null>(null);

    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    /**
     * ============================================================
     * GET STUDENT POINT SUMMARY
     * ============================================================
     */

    async function getStudentPointSummary(
        studentId: string,
        academicYearId: string
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            const response =
                await fetch(
                    `/api/students/${studentId}/points/${academicYearId}`
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch student point summary"
                );
            }

            const result: StudentPointDTO =
                await response.json();

            setStudentPoint(result);

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            }

        } finally {

            setLoading(false);

        }

    }

    /**
     * ============================================================
     * LIST STUDENT POINT SUMMARY
     * ============================================================
     */

    async function listStudentPointSummary(
        academicYearId: string
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            const response =
                await fetch(
                    `/api/students/points/${academicYearId}`
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch student point ranking"
                );
            }

            const result: StudentPointDTO[] =
                await response.json();

            setStudentPoint(result);

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            }

        } finally {

            setLoading(false);

        }

    }

    /**
     * ============================================================
     * RECALCULATE STUDENT POINT
     * ============================================================
     */

    async function recalculateStudentPoint(
        studentId: string,
        payload: {
            academicYearId: string;
            violationPoint: number;
            achievementPoint: number;
        }
    ): Promise<void> {

        try {

            setLoading(true);
            setError(null);

            const response =
                await fetch(
                    `/api/students/${studentId}/points/recalculate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to recalculate student point"
                );
            }

            const result: StudentPointDTO =
                await response.json();

            setStudentPoint(result);

        } catch (err) {

            if (err instanceof Error) {
                setError(err.message);
            }

        } finally {

            setLoading(false);

        }

    }

    return {

        studentPoint,
        loading,
        error,

        getStudentPointSummary,

        listStudentPointSummary,

        recalculateStudentPoint

    };

}