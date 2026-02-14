//Files: src/sections/violation/organisms/ViolationFormModal.tsx
"use client";

import type { ChangeEvent } from "react";
import { Modal } from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import type { ViolationLevel } from "@/generated/prisma";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle: string;

  loading?: boolean;
  submitDisabled?: boolean;

  form: {
    name: string;
    point: number;
    level: ViolationLevel;
  };

  errors?: Record<string, string>;

  onChange: (field: "name" | "point" | "level", value: string | number) => void;
}

export default function ViolationFormModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  form,
  errors = {},
  onChange,
  loading = false,
  submitDisabled = false,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      subtitle={subtitle}
      submitText="Simpan"
      size="md"
      submitLoading={loading}
      submitDisabled={submitDisabled}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Nama Pelanggaran"
            value={form.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("name", e.target.value)
            }
            error={!!errors.name}
            helperText={errors.name || "Masukkan nama pelanggaran"}
            className="md:col-span-2"
          />

          <TextField
            label="Jumlah Poin"
            type="number"
            value={form.point}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("point", Number(e.target.value))
            }
            error={!!errors.point}
            helperText={errors.point || "Masukkan jumlah poin"}
          />

          <SelectField
            label="Level Pelanggaran"
            value={form.level}
            onChange={(e) => onChange("level", e.target.value)}
            helperText="Pilih tingkat pelanggaran"
          >
            <option value="LIGHT">Ringan</option>
            <option value="MEDIUM">Sedang</option>
            <option value="HEAVY">Berat</option>
          </SelectField>
        </div>
      </div>
    </Modal>
  );
}
