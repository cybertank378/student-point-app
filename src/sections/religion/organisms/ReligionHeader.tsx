//Files: src/sections/religion/organisms/ReligionHeader.tsx
"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import Button from "@/shared-ui/component/Button";
import ReligionFormModal from "@/sections/religion/organisms/ReligionFormModal";

import { useReligionApi } from "@/modules/religion/presentation/hooks/useReligionApi";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import {HiPlusCircle} from "react-icons/hi";

interface FormState {
    kode: string;
    name: string;
}

interface Props {
    api: ReturnType<typeof useReligionApi>;
}

export default function ReligionHeader({ api }: Props) {
    const { createReligion } = api;

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        kode: "",
        name: "",
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
        if (!form.kode || !form.name) return;

        const payload: CreateReligionDTO = {
            kode: form.kode,
            name: form.name,
        };

        await createReligion(payload);

        setOpen(false);

        setForm({
            kode: "",
            name: "",
        });
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl text-gray-800 font-semibold">
                        Master Agama
                    </h1>
                    <p className="text-sm text-gray-500">
                        Kelola data agama
                    </p>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    leftIcon={HiPlusCircle}
                >
                    Tambah Agama
                </Button>
            </div>

            <ReligionFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                form={form}
                onChange={handleChange}
                title="Tambah Agama"
                subtitle="Tambahkan data agama baru"
            />
        </>
    );
}

