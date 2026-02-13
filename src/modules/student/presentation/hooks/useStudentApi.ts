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
import {usePagination} from "@/modules/shared/pagination/usePagination";
import {usePaginatedApi} from "@/modules/shared/pagination/usePaginatedApi";

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
     * =========================
     * FETCH STUDENTS
     * =========================
     */
    const fetchStudents = useCallback(
        async (query?: StudentQueryDTO) => {
            setLoading(true);

            try {
                setError(null);

                const params = query
                    ? `?${new URLSearchParams(
                        query as Record<string, string>,
                    ).toString()}`
                    : "";

                const res = await fetch(`/api/students${params}`);
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

    const pagination = usePagination(10);

    const api = usePaginatedApi<Student, StudentQueryDTO>({
        endpoint: "/api/students",
        initialQuery: {
            page: pagination.page,
            limit: pagination.limit,
        } as StudentQueryDTO,
    });

    return {
        students: api.rows,
        total: api.total,
        loading: api.loading,
        error: api.error,

        pagination,

        fetchStudents: (query: StudentQueryDTO) =>
            api.fetchPage(query),
    };

    /**
     * =========================
     * CREATE STUDENT
     * =========================
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
     * =========================
     * UPDATE STUDENT
     * =========================
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
     * =========================
     * DELETE STUDENT (SOFT)
     * =========================
     */
    const deleteStudent = useCallback(
        async (id: string) => {
            try {
                setError(null);

                const res = await fetch(
                    `/api/students/${id}`,
                    { method: "DELETE" },
                );

                if (!res.ok) {
                    setError(await parseError(res));
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
     * =========================
     * ASSIGN STUDENT → ROMBEL
     * =========================
     */
    const assignToRombel = useCallback(
        async (
            studentId: string,
            rombelId: string,
        ) => {
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
                    setError(await parseError(res));
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
     * =========================
     * BATCH ASSIGN → ROMBEL
     * =========================
     */
    const batchAssignToRombel = useCallback(
        async (
            studentIds: string[],
            rombelId: string,
        ) => {
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
                    setError(await parseError(res));
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
     * =========================
     * AUTO FETCH ON MOUNT
     * =========================
     */
    useEffect(() => {
        fetchStudents();
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
    };
};
