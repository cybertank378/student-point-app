//Files: src/modules/auth/domain/rbac/policyEngine.ts
import { Permission } from "./permissions";

interface PolicyRule {
    path: string;
    methods: string[];
    permission: Permission;
}

interface PolicyInput {
    path: string;
    method: string;
    permissions: Permission[];
}

const policyMatrix: PolicyRule[] = [
    {
        path: "/dashboard",
        methods: ["GET"],
        permission: "dashboard.view",
    },
    {
        path: "/api/users",
        methods: ["GET"],
        permission: "user.read",
    },
    {
        path: "/api/users",
        methods: ["POST", "PUT", "DELETE"],
        permission: "user.manage",
    },
    {
        path: "/api/academic-years",
        methods: ["GET", "POST", "PUT", "DELETE"],
        permission: "academicYear.manage",
    },
];

export function evaluatePolicy({
                                   path,
                                   method,
                                   permissions,
                               }: PolicyInput): boolean {
    const matched = policyMatrix
        .filter((rule) =>
            path.startsWith(rule.path)
        )
        .sort((a, b) => b.path.length - a.path.length)[0];

    if (!matched) return false;

    if (!matched.methods.includes(method.toUpperCase())) {
        return false;
    }

    return permissions.includes(matched.permission);
}
