//Files: src/modules/academic-year/presentation/hooks/useAcademicYearApi.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type {
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
} from "@/modules/academic-year/infrastructure/validators/AcademicYearSchema";

import {
  type ApiError,
  parseError,
  safeJson,
  toApiError,
} from "@/modules/shared/errors/ApiError";

/**
 * ============================================
 * ACADEMIC YEAR API HOOK
 * ============================================
 */
export const useAcademicYearApi = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ============================================
   * CLEAR ERROR (stable)
   * ============================================ */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ============================================
   * FETCH ALL
   * ============================================ */
  const fetchAcademicYears = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const res = await fetch("/api/academic-years");
      const data = await safeJson<AcademicYear[]>(res);
      setAcademicYears(data ?? []);
    } catch (err: unknown) {
      const apiError = toApiError(err, "Gagal mengambil data tahun ajaran");
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /* ============================================
   * CREATE
   * ============================================ */
  const createAcademicYear = useCallback(
    async (payload: CreateAcademicYearInput): Promise<AcademicYear> => {
      setLoading(true);
      clearError();

      try {
        const res = await fetch("/api/academic-years", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await safeJson<AcademicYear>(res);

        await fetchAcademicYears();

        return data;
      } catch (err: unknown) {
        const apiError = toApiError(err, "Gagal membuat tahun ajaran");
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchAcademicYears, clearError],
  );

  /* ============================================
   * UPDATE
   * ============================================ */
  const updateAcademicYear = useCallback(
    async (
      id: string,
      payload: UpdateAcademicYearInput,
    ): Promise<AcademicYear> => {
      setLoading(true);
      clearError();

      try {
        const res = await fetch(`/api/academic-years/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await safeJson<AcademicYear>(res);

        await fetchAcademicYears();

        return data;
      } catch (err: unknown) {
        const apiError = toApiError(err, "Gagal mengupdate tahun ajaran");
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchAcademicYears, clearError],
  );

  /* ============================================
   * SET ACTIVE
   * ============================================ */
  const setActiveAcademicYear = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      clearError();

      try {
        const res = await fetch(`/api/academic-years/${id}/activate`, {
          method: "PATCH",
        });

        if (!res.ok) {
          throw await parseError(res);
        }

        await fetchAcademicYears();
      } catch (err: unknown) {
        const apiError = toApiError(err, "Gagal mengaktifkan tahun ajaran");
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchAcademicYears, clearError],
  );

  /* ============================================
   * DELETE
   * ============================================ */
  const deleteAcademicYear = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      clearError();

      try {
        const res = await fetch(`/api/academic-years/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw await parseError(res);
        }

        await fetchAcademicYears();
      } catch (err: unknown) {
        const apiError = toApiError(err, "Gagal menghapus tahun ajaran");
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchAcademicYears, clearError],
  );

  /* ============================================
   * INITIAL LOAD
   * ============================================ */
  useEffect(() => {
    fetchAcademicYears().catch(() => {});
  }, [fetchAcademicYears]);

  return {
    academicYears,
    loading,
    error,
    clearError,
    fetchAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    setActiveAcademicYear,
    deleteAcademicYear,
  };
};
