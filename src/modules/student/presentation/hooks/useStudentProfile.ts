//Files: src/modules/student/presentation/hooks/useStudentProfile.ts
"use client";

import { useEffect, useState } from "react";
import { useStudentApi } from "@/modules/student/presentation/hooks/useStudentApi";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function useStudentProfile(username: string) {
  const { getStudentByNis } = useStudentApi();

  const [student, setStudent] = useState<StudentCompositeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const data = await getStudentByNis(username);

      console.log("PROFILE ", data);

      setStudent(data ?? null);

      setLoading(false);
    };

    void load();
  }, [username, getStudentByNis]);

  return {
    student,
    loading,
  };
}
