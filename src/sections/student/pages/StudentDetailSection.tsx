"use client";

import { useEffect, useState } from "react";
import { useStudentApi } from "@/modules/student/presentation/hooks/useStudentApi";
import { useSessionStorage } from "@/modules/student/presentation/hooks/useSessionStorage";

import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

import StudentChangePasswordCard from "@/sections/student/organisms/StudentChangePasswordCard";
import StudentParentCard from "@/sections/student/organisms/StudentParentCard";
import StudentProfileCard from "@/sections/student/organisms/StudentProfileCard";
import StudentProfileTabs from "@/sections/student/organisms/StudentProfileTabs";
import {useRouter} from "next/navigation";

export default function StudentDetailSection() {
  const router = useRouter();

  const { get } = useSessionStorage("studentId");

  const { getStudentById } = useStudentApi();

  const [student, setStudent] = useState<StudentCompositeDTO | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

      const studentId = get();

      if (!studentId) {

        router.push("/dashboard/students");

        return;
      }

      const data = await getStudentById(studentId);

      if (!data) {

        router.push("/dashboard/students");

        return;
      }

      setStudent(data);

      setLoading(false);

    };

    void load();

  }, [get, getStudentById, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return null;
  }

  if (!student) {
    return (
        <div className="p-6 text-center text-gray-500">
          Memuat data siswa...
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <StudentProfileCard student={student} loading={loading} />
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-6">
            <StudentChangePasswordCard />

            <StudentParentCard
                familyStatus={student?.familyStatus!}
                parents={student?.parents ?? []}
            />

            <StudentProfileTabs student={student} />
          </div>
        </div>
      </div>
  );
}