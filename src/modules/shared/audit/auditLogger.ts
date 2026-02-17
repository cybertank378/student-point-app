//Files: src/modules/shared/audit/auditLogger.ts

import {serverLog} from "@/libs/serverLogger";

export function auditLog(
    type: "ALLOW" | "DENY",
    data: {
        role?: string;
        path: string;
        method: string;
    }
) {
    if (process.env.NODE_ENV !== "production") {
        serverLog(
            `[AUDIT][${type}]`,
            JSON.stringify(data)
        );
    }
}
