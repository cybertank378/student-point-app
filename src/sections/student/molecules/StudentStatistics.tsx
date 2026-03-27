//Files: src/sections/student/molecules/StudentStatistics.tsx
//Files: src/sections/student/molecules/StudentStatistics.tsx
"use client";

import { useEffect, useState } from "react";
import type { StudentStatisticDTO } from "@/modules/student/domain/dto";
import { useStudentApi } from "@/modules/student/presentation/hooks/useStudentApi";

import AcademicPerformanceChart from "@/sections/student/atomic/AcademicPerformanceChart";
import StudentStatCard from "@/sections/student/atomic/StudentStatsCard";
import ViolationTrendChart from "@/sections/student/atomic/ViolationTrendChart";

interface Props {
    api: ReturnType<typeof useStudentApi>;
}
export default function StudentStatistics({api}: Props) {
    const { getStudentStatistics } = api;

    const [stats, setStats] = useState<StudentStatisticDTO | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getStudentStatistics();
            if (data) setStats(data);
        };

        void load();
    }, [getStudentStatistics]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* LEFT CARDS */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-3">
                <StudentStatCard
                    value={stats?.totalStudents.toLocaleString() ?? "0"}
                    title="Total Siswa"
                    iconKey="total"
                />

                <StudentStatCard
                    value={stats?.totalGrade7.toLocaleString() ?? "0"}
                    title="Siswa Kelas VII"
                    iconKey="grade7"
                />

                <StudentStatCard
                    value={stats?.totalGrade8.toLocaleString() ?? "0"}
                    title="Siswa Kelas VIII"
                    iconKey="grade8"
                />

                <StudentStatCard
                    value={stats?.totalGrade9.toLocaleString() ?? "0"}
                    title="Siswa Kelas IX"
                    iconKey="grade9"
                />
            </div>

            {/* PERFORMANCE CHART */}
            <div className="lg:col-span-5">
                <AcademicPerformanceChart
                    data={stats?.monthlyViolationByGrade ?? []}
                />
            </div>

            {/* VIOLATION TREND */}
            <div className="lg:col-span-4">
                <ViolationTrendChart
                    data={stats?.violationTrend ?? []}
                />
            </div>

        </div>
    );
}