//Files: src/modules/violation/presentation/hooks/useViolationForm.ts

"use client";

import { useMemo, useState } from "react";
import { CreateViolationSchema } from "@/modules/violation/infrastructur/validators/violationMaster.validator";
import type { ViolationLevel } from "@/generated/prisma";

export interface ViolationFormState {
  name: string;
  point: number;
  level: ViolationLevel;
}

export function useViolationForm(initial?: Partial<ViolationFormState>) {
  const [form, setForm] = useState<ViolationFormState>({
    name: initial?.name ?? "",
    point: initial?.point ?? 0,
    level: initial?.level ?? "LIGHT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValid = useMemo(() => {
    const result = CreateViolationSchema.safeParse({
      name: form.name,
      point: form.point,
    });

    return result.success;
  }, [form]);

  const validate = () => {
    const result = CreateViolationSchema.safeParse({
      name: form.name,
      point: form.point,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const onChange = (
    field: keyof ViolationFormState,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const reset = () => {
    setForm({
      name: "",
      point: 0,
      level: "LIGHT",
    });
    setErrors({});
  };

  return {
    form,
    errors,
    isValid,
    validate,
    onChange,
    reset,
    setForm,
  };
}
