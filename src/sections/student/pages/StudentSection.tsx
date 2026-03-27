// src/sections/student/pages/StudentSection.tsx

"use client";

import StudentTable from "@/sections/student/organisms/StudentTable";
import StudentHeader from "@/sections/student/organisms/StudentHeader";
import StudentStatistics from "@/sections/student/molecules/StudentStatistics";

import {useStudentApi} from "@/modules/student/presentation/hooks/useStudentApi";

export default function StudentSection() {

    const api = useStudentApi();

    return (
        <div className="space-y-6">

            <StudentStatistics api={api} />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">



                <StudentTable api={api} />

            </div>

        </div>
    );
}
