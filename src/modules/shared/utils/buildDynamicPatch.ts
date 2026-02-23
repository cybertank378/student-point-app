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
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    return a === b;
}

export function buildDynamicPatch<T extends object>(
    id: string,
    form: T,
    original: T,
    dependencies: DependencyRule<T>[] = []
): { id: string } & Partial<T> {

    const changes: Partial<T> = {};

    /**
     * ==============================
     * DIFF SECTION
     * ==============================
     */
    (Object.keys(form) as (keyof T)[]).forEach((key) => {
        const current = form[key];
        const prev = original[key];

        if (!isEqual(current, prev)) {
            // ❗ Jangan kirim undefined
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
                // ❗ hanya set null kalau field memang ada di original
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