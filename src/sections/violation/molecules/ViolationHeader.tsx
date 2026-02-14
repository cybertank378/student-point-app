//Files: src/sections/violation/molecules/ViolationHeader.tsx
"use client";

import { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";

import Button from "@/shared-ui/component/Button";
import ViolationFormModal from "@/sections/violation/organisms/ViolationFormModal";

import { useViolationMasterApi } from "@/modules/violation/presentation/hooks/useViolationApi";
import { CreateViolationSchema,  type CreateViolationInput} from "@/modules/violation/infrastructur/validators/violationMaster.validator";
import {showErrorToast, showSuccessToast} from "@/shared-ui/component/Toast";


type ViolationLevel = "LIGHT" | "MEDIUM" | "HEAVY";



interface Props {
    api: ReturnType<typeof useViolationMasterApi>;
}

interface FormState {
    name: string;
    point: number;
    level: ViolationLevel;
}

export default function ViolationHeader({ api }: Props) {
    const { createViolation, violations, fetchViolations } = api;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<FormState>({
        name: "",
        point: 0,
        level: "LIGHT",
    });

    const isValid =
        form.name.trim().length >= 3 &&
        form.point > 0;

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
        try {
            setLoading(true);

            // ================= ZOD VALIDATION =================
            const parsed = CreateViolationSchema.parse(form);

            // ================= OPTIMISTIC UI =================
            const optimisticItem = {
                id: "temp-" + Date.now(),
                ...parsed,
            };

            api.violations.unshift(
                optimisticItem as any
            );

            const created =
                await createViolation(parsed);

            if (!created) {
                showErrorToast("Gagal menambahkan pelanggaran");
                return;
            }

            showSuccessToast(
                "Pelanggaran berhasil ditambahkan"
            );

            setOpen(false);

            setForm({
                name: "",
                point: 0,
                level: "LIGHT",
            });

            await fetchViolations();
        } catch (err: any) {
            showErrorToast(
                err?.message ||
                "Terjadi kesalahan"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl text-gray-800 font-semibold">
                        Master Pelanggaran
                    </h1>
                    <p className="text-sm text-gray-500">
                        Daftar aturan dan poin pelanggaran siswa
                    </p>
                </div>

                <Button
                    leftIcon={HiPlusCircle}
                    onClick={() => setOpen(true)}
                >
                    Tambah Pelanggaran
                </Button>
            </div>

            {/* FORM MODAL */}
            <ViolationFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                title="Tambah Pelanggaran"
                subtitle="Lengkapi informasi pelanggaran dengan benar."
                form={form}
                onChange={handleChange}
            />

            {/* LOADING SUBMIT BUTTON STATE */}
            {open && (
                <div className="hidden">
                    {/* Force re-render trigger */}
                </div>
            )}
        </>
    );
}
