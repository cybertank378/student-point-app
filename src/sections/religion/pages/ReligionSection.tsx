//Files: src/sections/religion/pages/ReligionSection.tsx
"use client";

import ReligionTable from "@/sections/religion/molecules/ReligionTable";
import ReligionHeader from "@/sections/religion/organisms/ReligionHeader";
import {useReligionApi} from "@/modules/religion/presentation/hooks/useReligionApi";

export default function ReligionSection() {
    const api = useReligionApi();
    return (
        <div className="space-y-6">
            <ReligionHeader api={api} />
            <ReligionTable api={api} />

        </div>
    );
}
