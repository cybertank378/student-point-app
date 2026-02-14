//Files: src/shared-ui/component/LevelBadge.tsx

import {ViolationLevel} from "@/generated/prisma";

export default function LevelBadge({level}: {
    level: ViolationLevel;
}) {
    const colorMap = {
        LIGHT: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HEAVY: "bg-red-100 text-red-700",
    };

    const labelMap = {
        LIGHT: "Ringan",
        MEDIUM: "Sedang",
        HEAVY: "Berat",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[level]}`}
        >
      {labelMap[level]}
    </span>
    );
}