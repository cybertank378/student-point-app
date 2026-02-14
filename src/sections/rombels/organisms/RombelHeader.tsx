//Files: src/sections/rombels/molecules/RombelHeader.tsx

"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Button from "@/shared-ui/component/Button";
import RombelFormModal from "@/sections/rombels/organisms/RombelFormModal";
import {useRombelApi} from "@/modules/rombel/presentation/hooks/useRombelApi";

interface FormState {
    grade: "VII" | "VIII" | "IX";
    name: string;
    academicYearName: string;
}

interface Props {
    api: ReturnType<typeof useRombelApi>;
}


export default function RombelHeader({ api }: Props) {
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        grade: "VII",
        name: "",
        academicYearName: "2025",
    });

    const handleChange = (
        field: keyof FormState,
        value: string | number
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        // Nanti bisa dihubungkan ke API
        console.log("CREATE ROMBEL:", form);

        setOpen(false);

        setForm({
            grade: "VII",
            name: "",
            academicYearName: "2025",
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
                    leftIcon={FiPlus}
                >
                    Tambah Rombel
                </Button>
            </div>

            <RombelFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                form={form}
                onChange={handleChange}
                title="Tambah Rombel"
            />
        </>
    );
}
