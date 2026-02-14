//Files: src/modules/teacher/presentation/hooks/useTeacherApi.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";

import {
  type ApiError,
  parseError,
  safeJson,
  toApiError,
} from "@/modules/shared/errors/ApiError";

export const useTeacherApi = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * =========================
   * FETCH ALL TEACHERS
   * =========================
   */
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);

      const res = await fetch("/api/teachers");
      const list = await safeJson<Teacher[]>(res);

      setTeachers(list ?? []);
    } catch (err) {
      const apiErr = toApiError(err, "Gagal mengambil data guru");
      setError(apiErr);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * =========================
   * GET TEACHER BY ID
   * =========================
   */
  const getTeacherById = useCallback(
    async (id: string | null | undefined): Promise<Teacher | null> => {
      if (!id) return null;

      try {
        setError(null);

        const res = await fetch(`/api/teachers/${id}`);
        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
          return null;
        }

        return await safeJson<Teacher>(res);
      } catch (err) {
        const apiErr = toApiError(err, "Gagal mengambil data guru");
        setError(apiErr);
        return null;
      }
    },
    [],
  );

  /**
   * =========================
   * CREATE TEACHER
   * =========================
   */
  const createTeacher = useCallback(
    async (payload: CreateTeacherDTO): Promise<Teacher | null> => {
      try {
        setError(null);

        const res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = await safeJson<Teacher>(res);
        await fetchTeachers();

        return created ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menambahkan guru");
        setError(apiErr);
        return null;
      }
    },
    [fetchTeachers],
  );

  /**
   * =========================
   * UPDATE TEACHER
   * =========================
   */
  const updateTeacher = useCallback(
    async (payload: UpdateTeacherDTO): Promise<Teacher | null> => {
      try {
        setError(null);

        const res = await fetch(`/api/teachers/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const updated = await safeJson<Teacher>(res);
        await fetchTeachers();

        return updated ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal mengubah data guru");
        setError(apiErr);
        return null;
      }
    },
    [fetchTeachers],
  );

  /**
   * =========================
   * DELETE TEACHER
   * =========================
   */
  const deleteTeacher = useCallback(
    async (id: string): Promise<void> => {
      if (!id) return;

      try {
        setError(null);

        const res = await fetch(`/api/teachers/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
        }

        await fetchTeachers();
      } catch (err) {
        const apiErr = toApiError(err, "Gagal menghapus guru");
        setError(apiErr);
      }
    },
    [fetchTeachers],
  );

  /**
   * =========================
   * ASSIGN TEACHER ROLES
   * =========================
   */
  const assignTeacherRole = useCallback(
    async (payload: AssignTeacherRoleDTO): Promise<Teacher | null> => {
      try {
        setError(null);

        const res = await fetch(`/api/teachers/${payload.teacherId}/roles`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles: payload.roles }),
        });

        const updated = await safeJson<Teacher>(res);
        await fetchTeachers();

        return updated ?? null;
      } catch (err) {
        const apiErr = toApiError(err, "Gagal assign role guru");
        setError(apiErr);
        return null;
      }
    },
    [fetchTeachers],
  );

  /**
   * =========================
   * ASSIGN HOMEROOM (WALI KELAS)
   * =========================
   */
  const assignHomeroom = useCallback(
    async (teacherId: string, classId: string): Promise<void> => {
      try {
        setError(null);

        const res = await fetch(`/api/teachers/${teacherId}/assign-homeroom`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId }),
        });

        if (!res.ok) {
          const apiErr = await parseError(res);
          setError(apiErr);
        }

        await fetchTeachers();
      } catch (err) {
        const apiErr = toApiError(err, "Gagal assign wali kelas");
        setError(apiErr);
      }
    },
    [fetchTeachers],
  );

  /**
   * =========================
   * AUTO FETCH ON MOUNT
   * =========================
   */
  useEffect(() => {
    void fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,

    fetchTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    assignTeacherRole,
    assignHomeroom,
  };
};
