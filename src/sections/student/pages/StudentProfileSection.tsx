//Files: src/sections/student/pages/StudentProfileSection.tsx
"use client";

import { useStudentProfile } from "@/modules/student/presentation/hooks/useStudentProfile";
import StudentChangePasswordCard from "@/sections/student/organisms/StudentChangePasswordCard";
import StudentParentCard from "@/sections/student/organisms/StudentParentCard";
import StudentProfileCard from "@/sections/student/organisms/StudentProfileCard";
import StudentProfileTabs from "@/sections/student/organisms/StudentProfileTabs";
import Loading from "@/shared-ui/component/Loading";

interface Props {
  username: string;
}
export default function StudentProfileSection({ username }: Props) {
  const { student, loading } = useStudentProfile(username);

  if (loading) {
    return <Loading />;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <StudentProfileCard student={student} loading={loading} />
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          <StudentChangePasswordCard />
          <StudentParentCard familyStatus={student?.familyStatus!} parents={student?.parents ?? []} />

          <StudentProfileTabs student={student} />
        </div>
      </div>
    </div>
  );
}
