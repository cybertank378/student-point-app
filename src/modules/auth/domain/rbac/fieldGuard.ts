//Files: src/modules/auth/domain/rbac/fieldGuard.ts



import {Permission} from "@/modules/auth/domain/rbac/permissions";
import {FIELD_POLICY} from "@/modules/auth/domain/rbac/field.policy";

export function canAccessField(
    resource: keyof typeof FIELD_POLICY,
    field: string,
    permissions: Permission[],
): boolean {
    const rules =
        FIELD_POLICY[resource]?.[
            field as keyof typeof FIELD_POLICY[typeof resource]
            ];

    if (!rules) return true;

    return rules.some((p) =>
        permissions.includes(p),
    );
}
