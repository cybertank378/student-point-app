//Files: src/sections/academic-years/organisms/AcademicYearModal.tsx
"use client";

import { type ChangeEvent, useState } from "react";
import { Modal } from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import { z } from "zod";

/* ================= ZOD SCHEMA ================= */

const AcademicYearFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(9, "Format harus 9 karakter.")
      .max(9, "Format harus 9 karakter.")
      .regex(/^\d{4}\/\d{4}$/, "Format harus seperti 2024/2025"),

    startDate: z.string().min(1, "Tanggal mulai wajib diisi."),

    endDate: z.string().min(1, "Tanggal selesai wajib diisi."),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Tanggal selesai harus setelah tanggal mulai.",
    path: ["endDate"],
  });

/* ================= TYPES ================= */

interface FormState {
  name: string;
  startDate: string;
  endDate: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  title: string;
}

export default function AcademicYearModal({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  title,
}: Props) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  /* ================= VALIDATE ================= */

  const validate = (): boolean => {
    const result = AcademicYearFormSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState | undefined;

        if (field) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit();
  };

  return (
    <Modal open={open} onClose={onClose} onSubmit={handleSubmit} title={title}>
      <div className="space-y-4">
        <TextField
          label="Nama Tahun Ajaran"
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("name", e.target.value)
          }
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Tanggal Mulai"
          type="date"
          value={form.startDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("startDate", e.target.value)
          }
          error={!!errors.startDate}
          helperText={errors.startDate}
        />

        <TextField
          label="Tanggal Selesai"
          type="date"
          value={form.endDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("endDate", e.target.value)
          }
          error={!!errors.endDate}
          helperText={errors.endDate}
        />
      </div>
    </Modal>
  );
}
