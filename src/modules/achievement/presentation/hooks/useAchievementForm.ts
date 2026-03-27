//Files: src/modules/achievement/presentation/hooks/useAchievementForm.ts

"use client";

import { useState } from "react";

interface AchievementFormState {
    name: string;
    point: number;
}

type AchievementFormField = keyof AchievementFormState;

export function useAchievementForm() {
    const [form, setForm] = useState<AchievementFormState>({
        name: "",
        point: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ================= ON CHANGE ================= */
    const onChange = (
        field: AchievementFormField,
        value: string | number
    ): void => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    /* ================= VALIDATION ================= */
    const validateCreate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            newErrors.name = "Nama prestasi wajib diisi";
        }

        if (!form.point || form.point <= 0) {
            newErrors.point = "Poin harus lebih dari 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* ================= RESET ================= */
    const reset = (): void => {
        setForm({
            name: "",
            point: 0,
        });

        setErrors({});
    };

    return {
        form,
        errors,
        onChange,
        validateCreate,
        reset,
    };
}