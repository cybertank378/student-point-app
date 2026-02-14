//Files: src/modules/auth/domain/rbac/auditLogger.ts

import { serverLog } from "@/libs/serverLogger";

export function auditLog(
    role: string,
    path: string,
    method: string,
    allowed: boolean
) {
    serverLog("RBAC_AUDIT", {
        role,
        path,
        method,
        allowed,
        timestamp: new Date().toISOString(),
    });
}
