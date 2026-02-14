//Files: src/modules/shared/audit/auditLogger.ts

export function auditLog(
    type: "ALLOW" | "DENY",
    data: {
        role?: string;
        path: string;
        method: string;
    }
) {
    if (process.env.NODE_ENV !== "production") {
        console.log(
            `[AUDIT][${type}]`,
            JSON.stringify(data)
        );
    }
}
