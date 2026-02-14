//Files: src/sections/rombels/pages/RombelSection.tsx
"use client";

import RombelTable from "@/sections/rombels/molecules/RombelTable";
import RombelHeader from "@/sections/rombels/organisms/RombelHeader";
import {useRombelApi} from "@/modules/rombel/presentation/hooks/useRombelApi";
export default function RombelSection() {
    const api = useRombelApi();
    return (
        <div className="space-y-6">
            <RombelHeader api={api}/>
            <RombelTable api={api}/>
        </div>

    );
}
