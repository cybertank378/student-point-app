//Files: src/sections/student/organisms/StudentProfileTabs.tsx
"use client";

import clsx from "clsx";
import { useState } from "react";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import StudentAchievementTab from "@/sections/student/molecules/StudentAchievementTab";
import StudentAttendanceTab from "@/sections/student/molecules/StudentAttendanceTab";
import StudentCounselingTab from "@/sections/student/molecules/StudentCounselingTab";
import StudentOverviewTab from "@/sections/student/molecules/StudentOverviewTab";
import StudentPointTab from "@/sections/student/molecules/StudentPointTab";
import StudentViolationTab from "@/sections/student/molecules/StudentViolationTab";
import Button from "@/shared-ui/component/Button";


interface Props {
  student: StudentCompositeDTO | null;
}

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "violations", label: "Pelanggaran" },
  { key: "points", label: "Point Siswa" },
  { key: "achievements", label: "Prestasi" },
  { key: "attendance", label: "Kehadiran" },
  { key: "counseling", label: "Konseling BK" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function StudentProfileTabs({ student }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* TAB HEADER */}

      <div className="flex flex-wrap gap-2 p-3 border-b">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <Button
              variant="ghost"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                active ? "bg-indigo-500 text-white shadow-sm" : "bg-transparent text-indigo-500 hover:bg-[#666CFF]/10"
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      <div className="p-6">
        {activeTab === "overview" && <StudentOverviewTab student={student} />}

        {activeTab === "violations" && <StudentViolationTab violations={student?.violations ?? []} />}

        {activeTab === "points" && <StudentPointTab points={student?.point ?? []} />}

        {activeTab === "achievements" && <StudentAchievementTab achievements={student?.achievements ?? []} />}

        {activeTab === "attendance" && <StudentAttendanceTab attendances={student?.attendances ?? []} />}

        {activeTab === "counseling" && <StudentCounselingTab counselingCases={student?.counselingCases ?? []} />}
      </div>
    </div>
  );
}
