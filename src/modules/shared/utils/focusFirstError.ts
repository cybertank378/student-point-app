//Files: src/modules/shared/utils/focusFirstError.ts
export function focusFirstError(
    errors: Record<string, string>
) {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;

    const el = document.querySelector(
        `[data-field="${firstKey}"]`
    ) as HTMLElement | null;

    if (!el) return;

    el.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });

    el.focus();
}