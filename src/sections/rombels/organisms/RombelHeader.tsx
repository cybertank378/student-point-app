//Files: src/sections/rombels/molecules/RombelHeader.tsx
"use client";

import { useState } from "react";

import Button from "@/shared-ui/component/Button";
import RombelFormModal from "@/sections/rombels/organisms/RombelFormModal";

import { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";
import { useAcademicYearApi } from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";

import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import {HiPlusCircle} from "react-icons/hi";

type Grade = "VII" | "VIII" | "IX";

interface FormState {
    grade: Grade;
    name: string;
    academicYearId: string; // ✅ FIXED
}

interface Props {
    api: ReturnType<typeof useRombelApi>;
}

export default function RombelHeader({ api }: Props) {
    const { createRombel } = api;
    const { academicYears } = useAcademicYearApi(); // ✅ Needed for dropdown

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        grade: "VII",
        name: "",
        academicYearId: "",
    });

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

        // Reset form
        setForm({
            grade: "VII",
            name: "",
            academicYearId: "",
        });
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
                academicYears={academicYears} // ✅ FIX
                onChange={handleChange}
                title="Tambah Rombel"
                subtitle="Lengkapi informasi rombel dengan benar."
            />
        </>
    );
}

