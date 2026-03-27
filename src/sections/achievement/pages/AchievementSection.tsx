//Files: src/sections/Achievement/pages/AchievementSection.tsx

"use client";

import { useAchievementApi } from "@/modules/achievement/presentation/hooks/useAchievementApi";
import AchievementHeader from "@/sections/achievement/molecules/AchievementHeader";
import AchievementTable from "@/sections/achievement/organisms/AchievementTable";

export default function AchievementSection() {
    const api = useAchievementApi();

    return (
        <div className="space-y-6">
            <AchievementHeader api={api} />
            <AchievementTable api={api} />
        </div>
    );
}