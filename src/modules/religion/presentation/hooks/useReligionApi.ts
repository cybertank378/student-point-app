//Files: src/modules/religion/presentation/hooks/useReligionApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type { Religion } from "@/modules/religion/domain/entity/Religion";

import {
  type ApiError,
  parseError,
  safeJson,
  toApiError,
} from "@/modules/shared/errors/ApiError";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";

/**
 * useReligionApi
 * --------------
 * Frontend hook untuk CRUD Religion
 */
export const useReligionApi = () => {
  const [religions, setReligions] = useState<Religion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * =========================
   * FETCH ALL
   * =========================
   */
  const fetchReligions = useCallback(async () => {
    setLoading(true);

    try {
      setError(null);

      const res = await fetch("/api/religions");
      const list = await safeJson<Religion[]>(res);

      setReligions(list ?? []);
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengambil data agama");
      setError(apiErr);
      setReligions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * =========================
   * GET BY ID
   * =========================
   */
  const getReligionById = useCallback(
    async (id: string): Promise<Religion | null> => {
      if (!id) return null;

      try {
        setError(null);

        const res = await fetch(`/api/religions/${id}`);

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        const religion = await safeJson<Religion>(res);
        return religion ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal mengambil detail agama");
        setError(apiErr);
        return null;
      }
    },
    [],
  );

  /**
   * =========================
   * CREATE
   * =========================
   */
  const createReligion = useCallback(
    async (payload: CreateReligionDTO): Promise<Religion | null> => {
      try {
        setError(null);

        const res = await fetch("/api/religions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        const created = await safeJson<Religion>(res);
        await fetchReligions();

        return created ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menambah agama");
        setError(apiErr);
        return null;
      }
    },
    [fetchReligions],
  );

  /**
   * =========================
   * UPDATE
   * =========================
   */
  const updateReligion = useCallback(
    async (payload: UpdateReligionDTO): Promise<Religion | null> => {
      try {
        setError(null);

        const res = await fetch(`/api/religions/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        const updated = await safeJson<Religion>(res);
        await fetchReligions();

        return updated ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal mengubah agama");
        setError(apiErr);
        return null;
      }
    },
    [fetchReligions],
  );

  /**
   * =========================
   * DELETE
   * =========================
   */
  const deleteReligion = useCallback(
    async (id: string): Promise<void> => {
      if (!id) return;

      try {
        setError(null);

        const res = await fetch(`/api/religions/${id}`, { method: "DELETE" });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return;
        }

        await fetchReligions();
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menghapus agama");
        setError(apiErr);
      }
    },
    [fetchReligions],
  );

  /**
   * =========================
   * INITIAL LOAD
   * =========================
   */
  useEffect(() => {
    void fetchReligions();
  }, [fetchReligions]);

  return {
    religions,
    loading,
    error,

    fetchReligions,
    getReligionById,
    createReligion,
    updateReligion,
    deleteReligion,
  };
};
