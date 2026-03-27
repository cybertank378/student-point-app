//Files: src/sections/rombels/molecules/RombelHeader.tsx
"use client";

import { useState } from "react";

import Button from "@/shared-ui/component/Button";
import RombelFormModal from "@/sections/rombels/organisms/RombelFormModal";

import type { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";

import { HiPlusCircle } from "react-icons/hi";

type Grade = "VII" | "VIII" | "IX";

interface FormState {
  grade: Grade;
  name: string;
  academicYearId: string;
}

interface Props {
  api: ReturnType<typeof useRombelApi>;
  academicYears: AcademicYear[];
}

export default function RombelHeader({
                                       api,
                                       academicYears,
                                     }: Props) {

  const { createRombel } = api;

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<FormState>({
    grade: "VII",
    name: "",
    academicYearId: "",
  });

  const resetForm = () => {
    setForm({
      grade: "VII",
      name: "",
      academicYearId: "",
    });
  };

  const handleChange = (
      field: keyof FormState,
      value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {

    if (!form.name || !form.academicYearId) return;

    const payload: CreateRombelDTO = {
      grade: form.grade,
      name: form.name,
      academicYearId: form.academicYearId,
    };

    await createRombel(payload);

    setOpen(false);
    resetForm();
  };

  return (
      <>
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl text-gray-800 font-semibold">
              Master Data Kelas
            </h1>

            <p className="text-sm text-gray-500">
              Kelola rombongan belajar per tahun ajaran
            </p>
          </div>

          <Button
              onClick={() => setOpen(true)}
              leftIcon={HiPlusCircle}
          >
            Tambah Rombel
          </Button>

        </div>

        <RombelFormModal
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            form={form}
            academicYears={academicYears}
            onChange={handleChange}
            title="Tambah Rombel"
            subtitle="Lengkapi informasi rombel dengan benar."
        />
      </>
  );
}