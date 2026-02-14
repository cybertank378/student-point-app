// src/sections/rombels/molecules/RombelFormModal.tsx
"use client";

import { Modal } from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import type { ChangeEvent } from "react";

interface AcademicYearOption {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle: string;

  form: {
    grade: "VII" | "VIII" | "IX";
    name: string;
    academicYearId: string; // ✅ FIXED
  };

  academicYears: AcademicYearOption[]; // ✅ dropdown data

  onChange: (field: "grade" | "name" | "academicYearId", value: string) => void;
}

export default function RombelFormModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  form,
  academicYears,
  onChange,
}: Props) {
  const getPreviewLabel = () => {
    return `${form.grade}.${form.name || "X"}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      subtitle={subtitle}
      submitText="Simpan"
      size="lg"
    >
      <div className="space-y-8">
        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tingkat */}
          <SelectField
            label="Tingkat"
            value={form.grade}
            onChange={(e) => onChange("grade", e.target.value)}
            helperText="Pilih tingkat kelas"
          >
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
            <option value="IX">IX</option>
          </SelectField>

          {/* Nama Kelas */}
          <TextField
            label="Nama Kelas"
            placeholder="Contoh: A"
            value={form.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("name", e.target.value.toUpperCase())
            }
            helperText="Gunakan huruf kapital"
          />

          {/* Tahun Ajaran (Select by ID, show Name) */}
          <SelectField
            label="Tahun Ajaran"
            value={form.academicYearId}
            onChange={(e) => onChange("academicYearId", e.target.value)}
            helperText="Pilih tahun ajaran"
            className="md:col-span-2"
          >
            <option value="">-- Pilih Tahun Ajaran --</option>

            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </SelectField>
        </div>

        {/* PREVIEW CARD */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-indigo-500 mb-2">
            Preview Label
          </p>

          <p className="text-3xl font-semibold text-gray-700 tracking-wide break-words whitespace-normal leading-relaxed max-w-full mx-auto">
            {getPreviewLabel()}
          </p>
        </div>
      </div>
    </Modal>
  );
}
