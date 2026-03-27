//Files: src/sections/rombels/pages/RombelSection.tsx
"use client";

import { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";
import { useAcademicYearApi } from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";
import RombelHeader from "@/sections/rombels/organisms/RombelHeader";
import RombelTable from "@/sections/rombels/molecules/RombelTable";

export default function RombelSection() {

    const rombelApi = useRombelApi();
    const academicYearApi = useAcademicYearApi();

    return (
        <div className="space-y-6">

            <RombelHeader
                api={rombelApi}
                academicYears={academicYearApi.academicYears}
            />

            <RombelTable
                api={rombelApi}
                academicYears={academicYearApi.academicYears}
            />

        </div>
    );
}