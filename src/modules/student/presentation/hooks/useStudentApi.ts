// Files: src/modules/student/presentation/hooks/useStudentApi.ts
// Files: src/modules/student/presentation/hooks/useStudentApi.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { downloadFileFromResponse } from "@/libs/downloadFile";
import { type ApiError, parseError, safeJson, toApiError } from "@/modules/shared/errors/ApiError";
import type { StudentStatisticDTO } from "@/modules/student/domain/dto";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { StudentRespDTO } from "@/modules/student/domain/dto/StudentRespDTO";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import {BasePaginationParams} from "@/modules/shared/http/pagination/BasePagination";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/* ============================================================
 * RESPONSE TYPE
 * ============================================================ */

interface ListStudentResponse {
  data: StudentListCompositeDTO[];
  total: number;
  page: number;
  limit: number;
}


/* ============================================================
 * HOOK
 * ============================================================ */

export const useStudentApi = (autoFetch = false) => {
  const [students, setStudents] = useState<StudentListCompositeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ============================================================
   * INTERNAL REQUEST
   * ============================================================ */

  const requestList = useCallback(
      async (
          endpoint: string,
          params?: StudentListParams
      ): Promise<ListStudentResponse | null> => {
        try {
          setLoading(true);
          setError(null);

          const query = new URLSearchParams();

          query.set("page", String(params?.page ?? 1));
          query.set("limit", String(params?.limit ?? 10));

          if (params?.search) {
            query.set("search", params.search);
          }

          if (params?.classId) {
            query.set("classId", params.classId);
          }

          if (params?.isDifable !== undefined) {
            query.set("isDifable", String(params.isDifable));
          }

          if (params?.status) {
            query.set("status", params.status);
          }

          const res = await fetch(`/api/students${endpoint}?${query.toString()}`);

          if (!res.ok) {
            const apiErr = await parseError(res);
            setError(apiErr);
            return null;
          }


          const payload = await safeJson<ListStudentResponse>(res);

          setStudents(prev => {
            const next = payload.data ?? [];

            if (JSON.stringify(prev) === JSON.stringify(next)) {
              return prev;
            }

            return next;
          });

          return payload;
        } catch (err) {
          const apiError = toApiError(
              err,
              "Terjadi kesalahan saat mengambil data siswa."
          );

          setError(apiError);
          return null;
        } finally {
          setLoading(false);
        }
      },
      []
  );

  /* ============================================================
   * LIST STUDENTS
   * ============================================================ */

  const fetchStudents = useCallback((params?: StudentListParams) => {

        return requestList("", params);
      },
      [requestList]
  );

  /* ============================================================
   * GET BY ID
   * ============================================================ */

  const getStudentById = useCallback(async (id: string): Promise<StudentCompositeDTO | null> => {
    try {
      setError(null);

      const res = await fetch(`/api/students/${id}`);

      if (!res.ok) {
        const apiErr = await parseError(res);
        setError(apiErr);

        return null;
      }

      return await safeJson<StudentCompositeDTO>(res);
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengambil detail siswa.");

      setError(apiErr);

      return null;
    }
  }, []);

  /* ============================================================
   * GET BY NIS
   * ============================================================ */

  const getStudentByNis = useCallback(async (nis: string): Promise<StudentCompositeDTO | null> => {
    try {
      setError(null);

      const res = await fetch(`/api/students/nis/${nis}`);

      if (!res.ok) {
        const apiErr = await parseError(res);
        setError(apiErr);

        return null;
      }

      return await safeJson<StudentCompositeDTO>(res);
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengambil siswa berdasarkan NIS.");

      setError(apiErr);

      return null;
    }
  }, []);

  /* ============================================================
   * CREATE
   * ============================================================ */

  const createStudent = useCallback(
    async (payload: CreateStudentDTO): Promise<StudentRespDTO | null> => {
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
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        const json = await safeJson<{ data: StudentRespDTO }>(res);

        return json.data;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menambahkan siswa.");
        setError(apiErr);
        return null;
      }
    },
    [fetchStudents]
  );

  /* ============================================================
   * UPDATE
   * ============================================================ */

  const updateStudent = useCallback(
      async (payload: UpdateStudentDTO): Promise<StudentRespDTO | null> => {
        try {

          setError(null);

          const res = await fetch(`/api/students/${payload.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const apiErr = await parseError(res);
            setError(apiErr);
            return null;
          }

          const updated = await safeJson<StudentRespDTO>(res);

          await fetchStudents();

          return updated;

        } catch (err) {

          const apiErr = toApiError(err, "Gagal mengubah data siswa. ssssss");
          setError(apiErr);
          return null;

        }
      },
      [fetchStudents]
  );

  /* ============================================================
   * DELETE
   * ============================================================ */

  const deleteStudent = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const res = await fetch(`/api/students/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return false;
        }

        return true;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menghapus siswa.");
        setError(apiErr);
        return false;
      }
    },
    [fetchStudents]
  );

  /* ============================================================
   * IMPORT STUDENTS
   * ============================================================ */

  const importStudents = useCallback(
    async (file: File): Promise<ApiError | null> => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/students/import", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return apiErr;
        }

        return null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal import siswa.");
        setError(apiErr);
        return apiErr;
      }
    },
    [fetchStudents]
  );

  /* ============================================================
   * DOWNLOAD TEMPLATE
   * ============================================================ */

  const downloadImportTemplate = useCallback(async (): Promise<ApiError | null> => {
    try {
      setError(null);

      const res = await fetch("/api/students/import-template");

      if (!res.ok) {
        const apiErr = await parseError(res);
        setError(apiErr);
        return apiErr;
      }

      await downloadFileFromResponse(res, "student-import-template.xlsx");

      return null;
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengunduh template import.");
      setError(apiErr);
      return apiErr;
    }
  }, []);
  /**
   * ============================================================
   * USE STUDENT STATISTICS HOOK
   * ============================================================
   *
   * Hook untuk mengambil statistik siswa dari API.
   *
   * Endpoint:
   * GET /api/students/statistics
   */

  const getStudentStatistics = useCallback(async (): Promise<StudentStatisticDTO | null> => {
    try {
      setError(null);

      const res = await fetch("/api/students/statistics");

      if (!res.ok) {
        const apiErr = await parseError(res);
        setError(apiErr);

        return null;
      }

      return await safeJson<StudentStatisticDTO>(res);
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengambil statistik siswa.");

      setError(apiErr);

      return null;
    }
  }, []);

  /* ============================================================
   * UPLOAD STUDENT IMAGE
   * ============================================================ */

  const uploadStudentImage = useCallback(
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

          const res = await fetch(`/api/students/${id}/photo`,
              {
                method: "POST",
                body: formData,
              }
          );

          const result = await safeJson<{ fileName: string }>(res);

          return {
            data: result,
            error: null,
          };

        } catch (err) {

          const apiError = toApiError(
              err,
              "Gagal mengupload foto siswa."
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

  /* ============================================================
   * AUTO FETCH
   * ============================================================ */

  useEffect(() => {
    if (!autoFetch) return;
    void fetchStudents();
  }, [autoFetch, fetchStudents]);

  return {
    students,
    loading,
    error,

    fetchStudents,
    getStudentById,
    getStudentByNis,
    createStudent,
    getStudentStatistics,
    updateStudent,
    deleteStudent,
    importStudents,
    downloadImportTemplate,
    uploadStudentImage
  };
};
