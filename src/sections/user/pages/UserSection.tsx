//Files: src/sections/user/pages/UserSection.tsx
"use client";

import {useEffect} from "react";
import { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
import UserStat from "@/sections/user/molecules/UserStats";
import UserHeader from "@/sections/user/organisms/UserHeader";
import UserTable from "@/sections/user/organisms/UserTable";

export default function UserSection() {
    const api = useUserApi(true);

    return (
        <div className="space-y-6">
            <UserStat api={api} />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <UserHeader api={api} />
                <UserTable api={api} />
            </div>
        </div>
    ) ;
}
