//Files: src/sections/teacher/pages/TeacherSection.tsx

"use client";

import TeacherTable from "@/sections/teacher/organisms/TeacherTable";
import TeacherHeader from "@/sections/teacher/organisms/TeacherHeader";

export default function TeacherSection() {

    return (
        <div className="space-y-6">

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <TeacherHeader />
                <TeacherTable />
            </div>

        </div>
    );
}
