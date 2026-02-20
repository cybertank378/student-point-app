//Files: src/sections/teacher/pages/TeacherSection.tsx

"use client";

import TeacherTable from "@/sections/teacher/organisms/TeacherTable";
import TeacherHeader from "@/sections/teacher/organisms/TeacherHeader";
import {useUserApi} from "@/modules/user/presentation/hooks/useUserApi";
import {useTeacherApi} from "@/modules/teacher/presentation/hooks/useTeacherApi";

export default function TeacherSection() {
    const api = useTeacherApi();

    return (
        <div className="space-y-6">

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <TeacherHeader api={api} />
                <TeacherTable api={api} />
            </div>

        </div>
    );
}
