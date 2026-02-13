//Files: src/sections/academic-years/pages/AcademicYearSection.tsx
"use client";

import AcademicYearHeader from "@/sections/academic-years/organisms/AcademicYearHeader";
import AcademicYearTable from "@/sections/academic-years/molecules/AcademicYearTable";
import {useAcademicYearApi} from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";

export default function AcademicYearSection() {
    const api = useAcademicYearApi();

    return (
        <div className="space-y-6">
            <AcademicYearHeader api={api} />
            <AcademicYearTable  api={api} />
        </div>
    );
}
