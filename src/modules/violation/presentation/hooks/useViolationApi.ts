//Files: src/modules/violation/presentation/hooks/useViolationApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Violation } from "@/modules/violation/domain/entity/Violation";

import {
  type ApiError,
  parseError,
  safeJson,
  toApiError,
} from "@/modules/shared/errors/ApiError";
import type { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";

export const useViolationMasterApi = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * ===============================
   * FETCH ALL
   * ===============================
   */
  const fetchViolations = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);

      const res = await fetch("/api/violations-master");
      const list = await safeJson<Violation[]>(res);

      setViolations(list ?? []);
    } catch (err) {
      const apiErr = toApiError(err, "Failed to fetch violations");
      setError(apiErr);
      setViolations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ===============================
   * GET BY ID
   * ===============================
   */
  const getViolationById = useCallback(
    async (id: string | null | undefined): Promise<Violation | null> => {
      if (!id) {
        console.warn("getViolationById called without id");
        return null;
      }

      try {
        setError(null);

        const res = await fetch(`/api/violations-master/${id}`);
        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        const violation = await safeJson<Violation>(res);
        return violation ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Failed to fetch violation");
        setError(apiErr);
        return null;
      }
    },
    [],
  );

  /**
   * ===============================
   * CREATE
   * ===============================
   */
  const createViolation = useCallback(
    async (payload: CreateViolationDTO): Promise<Violation | null> => {
      try {
        setError(null);

        const res = await fetch("/api/violations-master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = await safeJson<Violation>(res);
        await fetchViolations();

        return created ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Failed to create violation");
        setError(apiErr);
        console.error("createViolation error", err);
        return null;
      }
    },
    [fetchViolations],
  );

  /**
   * ===============================
   * UPDATE
   * ===============================
   */
  const updateViolation = useCallback(
    async (payload: UpdateViolationDTO): Promise<Violation | null> => {
      try {
        setError(null);

        const res = await fetch(`/api/violations-master/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const updated = await safeJson<Violation>(res);
        await fetchViolations();

        return updated ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Failed to update violation");
        setError(apiErr);
        console.error("updateViolation error", err);
        return null;
      }
    },
    [fetchViolations],
  );

  /**
   * ===============================
   * DELETE (SOFT DELETE)
   * ===============================
   */
  const deleteViolation = useCallback(
    async (id: string): Promise<void> => {
      if (!id) return;

      try {
        setError(null);

        const res = await fetch(`/api/violations-master/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          console.error("deleteViolation failed", apiErr);
        }

        await fetchViolations();
      } catch (err) {
        const apiErr = toApiError(err, "Failed to delete violation");
        setError(apiErr);
        console.error("deleteViolation error", err);
      }
    },
    [fetchViolations],
  );

  /**
   * ===============================
   * INITIAL FETCH
   * ===============================
   */
  useEffect(() => {
    (async () => {
      await fetchViolations();
    })();
  }, [fetchViolations]);

  return {
    violations,
    loading,
    error, // error?.code / error?.statusCode → bisa dipakai UI
    fetchViolations,
    getViolationById,
    createViolation,
    updateViolation,
    deleteViolation,
  };
};
