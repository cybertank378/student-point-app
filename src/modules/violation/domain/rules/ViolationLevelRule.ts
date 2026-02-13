//Files: src/modules/violation/domain/rules/ViolationLevelRule.ts

// src/modules/violation/domain/rules/ViolationLevelRule.ts
import { ViolationLevel } from "@/generated/prisma";

export function resolveViolationLevel(point: number): ViolationLevel {
    if (point >= 10 && point <= 30) return "LIGHT";
    if (point >= 31 && point <= 60) return "MEDIUM";
    if (point >= 61 && point <= 100) return "HEAVY";

    throw new Error("Point pelanggaran tidak valid (10–100)");
}
