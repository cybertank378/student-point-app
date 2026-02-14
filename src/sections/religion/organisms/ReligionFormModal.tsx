//Files: src/sections/religion/organisms/ReligionFormModal.tsx

"use client";

import { Modal } from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import type { ChangeEvent } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle: string;

  form: {
    kode: string;
    name: string;
  };

  onChange: (field: "kode" | "name", value: string) => void;
}

export default function ReligionFormModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  form,
  onChange,
}: Props) {
  const getPreviewLabel = () => {
    if (!form.kode && !form.name) return "-";
    return `${form.kode || "XXX"} - ${form.name || "Nama Agama"}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      subtitle={subtitle}
      submitText="Simpan"
      size="md"
    >
      <div className="space-y-8">
        {/* ================= FORM GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kode */}
          <TextField
            label="Kode Agama"
            placeholder="Contoh: ISL"
            value={form.kode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("kode", e.target.value.toUpperCase())
            }
            helperText="Gunakan 3 huruf kapital"
          />

          {/* Nama */}
          <TextField
            label="Nama Agama"
            placeholder="Contoh: Islam"
            value={form.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("name", e.target.value)
            }
            helperText="Masukkan nama agama"
          />
        </div>

        {/* ================= PREVIEW CARD ================= */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-indigo-500 mb-2">
            Preview
          </p>

          <p className="text-2xl font-semibold text-gray-700 tracking-wide break-words whitespace-normal leading-relaxed max-w-full mx-auto">
            {getPreviewLabel()}
          </p>
        </div>
      </div>
    </Modal>
  );
}
