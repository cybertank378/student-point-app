// ============================================================
// DYNAMIC DEPENDENCY-AWARE PATCH BUILDER
// Strict • Generic • Production Safe
// ============================================================

export type DependencyRule<T extends object> = {
    when: (form: T, original: T) => boolean;
    include?: (keyof T)[];
    setNull?: (keyof T)[];
};

function isEqual(a: unknown, b: unknown): boolean {

    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    // shallow object compare
    if (
        typeof a === "object" &&
        typeof b === "object" &&
        a !== null &&
        b !== null
    ) {

        const aKeys = Object.keys(a as object);
        const bKeys = Object.keys(b as object);

        if (aKeys.length !== bKeys.length) return false;

        for (const key of aKeys) {
            if (
                (a as Record<string, unknown>)[key] !==
                (b as Record<string, unknown>)[key]
            ) {
                return false;
            }
        }

        return true;
    }

    return false;
}

export function buildDynamicPatch<T extends object>(
    id: string,
    form: T,
    original: T,
    dependencies: DependencyRule<T>[] = [],
    ignoreFields: (keyof T)[] = []
): { id: string } & Partial<T> {

    const changes: Partial<T> = {};

    /**
     * ==============================
     * DIFF SECTION
     * ==============================
     */

    (Object.keys(form) as (keyof T)[]).forEach((key) => {

        if (ignoreFields.includes(key)) return;

        const current = form[key];
        const prev = original[key];

        if (!isEqual(current, prev)) {

            if (current !== undefined) {
                changes[key] = current;
            }

        }

    });

    /**
     * ==============================
     * DEPENDENCY SECTION
     * ==============================
     */

    dependencies.forEach((rule) => {

        if (rule.when(form, original)) {

            rule.include?.forEach((key) => {

                const value = form[key];

                if (value !== undefined) {
                    changes[key] = value;
                }

            });

            rule.setNull?.forEach((key) => {

                if (original[key] !== undefined) {
                    changes[key] = null as T[typeof key];
                }

            });

        }

    });

    return {
        id,
        ...changes,
    };
}