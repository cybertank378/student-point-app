//Files: src/sections/academic-years/organisms/AcademicYearHeader.tsx
"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Button from "@/shared-ui/component/Button";
import AcademicYearModal from "./AcademicYearModal";
import { useAcademicYearApi } from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";

interface FormState {
    name: string;
    startDate: string;
    endDate: string;
}

interface Props {
    api: ReturnType<typeof useAcademicYearApi>;
}


export default function AcademicYearHeader({ api }: Props) {
    const { createAcademicYear } = api;

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        name: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (
        field: keyof FormState,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        console.log("FORM:", form);
    };

    const handleSubmit = async () => {

        const payload: CreateAcademicYearDTO = {
            name: form.name,
            startDate: new Date(form.startDate),
            endDate: new Date(form.endDate),
        };


        await createAcademicYear(payload);

        setOpen(false);

        setForm({
            name: "",
            startDate: "",
            endDate: "",
        });
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Tahun Ajaran
                    </h1>
                    <p className="text-sm text-gray-500">
                        Kelola tahun ajaran sekolah
                    </p>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    leftIcon={FiPlus}
                >
                    Tambah Tahun Ajaran
                </Button>
            </div>

            <AcademicYearModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                form={form}
                onChange={handleChange}
                title="Tambah Tahun Ajaran"
            />
        </>
    );
}



