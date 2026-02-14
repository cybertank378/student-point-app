//Files: src/modules/student/presentation/hooks/useStudentApi.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Student } from "@/modules/student/domain/entity/Student";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import type { StudentQueryDTO } from "@/modules/student/domain/dto/StudentQueryDTO";

import {
    type ApiError,
    parseError,
    safeJson,
    toApiError,
} from "@/modules/shared/errors/ApiError";

/**
 * Response shape dari GET /api/students
 */
interface StudentListResponse {
    rows: Student[];
    total: number;
}

export const useStudentApi = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    /**
     * =====================================================
     * GET    /api/students
     * =====================================================
     */
    const fetchStudents = useCallback(
        async (query?: StudentQueryDTO): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const params = query
                    ? `?${new URLSearchParams(
                        query as Record<string, string>,
                    ).toString()}`
                    : "";

                const res = await fetch(`/api/students${params}`);

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                const data =
                    await safeJson<StudentListResponse>(res);

                setStudents(data?.rows ?? []);
                setTotal(data?.total ?? 0);
            } catch (err) {
                setError(
                    toApiError(err, "Failed to fetch students"),
                );
                setStudents([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * =====================================================
     * POST   /api/students
     * =====================================================
     */
    const createStudent = useCallback(
        async (
            payload: CreateStudentDTO,
        ): Promise<Student | null> => {
            try {
                setError(null);

                const res = await fetch("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return null;
                }

                const created =
                    await safeJson<Student>(res);

                await fetchStudents();
                return created ?? null;
            } catch (err) {
                setError(
                    toApiError(err, "Failed to create student"),
                );
                return null;
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * PUT    /api/students/:id
     * =====================================================
     */
    const updateStudent = useCallback(
        async (
            payload: UpdateStudentDTO,
        ): Promise<Student | null> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/students/${payload.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return null;
                }

                const updated =
                    await safeJson<Student>(res);

                await fetchStudents();
                return updated ?? null;
            } catch (err) {
                setError(
                    toApiError(err, "Failed to update student"),
                );
                return null;
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * DELETE /api/students/:id
     * =====================================================
     */
    const deleteStudent = useCallback(
        async (id: string): Promise<void> => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/students/${id}`,
                    { method: "DELETE" },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                await fetchStudents();
            } catch (err) {
                setError(
                    toApiError(err, "Failed to delete student"),
                );
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * POST   /api/students/assign-rombel
     * =====================================================
     */
    const assignToRombel = useCallback(
        async (
            studentId: string,
            rombelId: string,
        ): Promise<void> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/students/assign-rombel",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studentId,
                            rombelId,
                        }),
                    },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                await fetchStudents();
            } catch (err) {
                setError(
                    toApiError(
                        err,
                        "Failed to assign student to rombel",
                    ),
                );
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * POST   /api/students/batch-assign-rombel
     * =====================================================
     */
    const batchAssignToRombel = useCallback(
        async (
            studentIds: string[],
            rombelId: string,
        ): Promise<void> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/students/batch-assign-rombel",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studentIds,
                            rombelId,
                        }),
                    },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                await fetchStudents();
            } catch (err) {
                setError(
                    toApiError(
                        err,
                        "Failed to batch assign students",
                    ),
                );
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * POST   /api/students/assign-academic-year
     * =====================================================
     */
    const assignAcademicYear = useCallback(
        async (
            studentId: string,
            rombelId: string,
        ): Promise<void> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/students/assign-academic-year",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studentId,
                            rombelId,
                        }),
                    },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                await fetchStudents();
            } catch (err) {
                setError(
                    toApiError(
                        err,
                        "Failed to assign academic year",
                    ),
                );
            }
        },
        [fetchStudents],
    );

    /**
     * =====================================================
     * POST   /api/students/batch-assign-academic-year
     * =====================================================
     */
    const batchAssignAcademicYear = useCallback(
        async (
            studentIds: string[],
            rombelId: string,
        ): Promise<void> => {
            try {
                setError(null);

                const res = await fetch(
                    "/api/students/batch-assign-academic-year",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studentIds,
                            rombelId,
                        }),
                    },
                );

                if (!res.ok) {
                    const apiError = await parseError(res);
                    setError(apiError);
                    return;
                }

                await fetchStudents();
            } catch (err) {
                setError(
                    toApiError(
                        err,
                        "Failed to batch assign academic year",
                    ),
                );
            }
        },
        [fetchStudents],
    );

    /**
     * =========================
     * AUTO FETCH ON MOUNT
     * =========================
     */
    useEffect(() => {
        void fetchStudents();
    }, [fetchStudents]);

    return {
        students,
        total,
        loading,
        error,

        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent,
        assignToRombel,
        batchAssignToRombel,
        assignAcademicYear,
        batchAssignAcademicYear,
    };
};
