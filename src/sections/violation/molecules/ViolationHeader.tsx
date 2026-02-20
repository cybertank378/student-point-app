//Files: src/sections/violation/molecules/ViolationHeader.tsx
"use client";

import { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";

import Button from "@/shared-ui/component/Button";
import ViolationFormModal from "@/sections/violation/organisms/ViolationFormModal";
import { useViolationForm } from "@/modules/violation/presentation/hooks/useViolationForm";
import type { useViolationApi } from "@/modules/violation/presentation/hooks/useViolationApi";
import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";
import { serverLog } from "@/libs/serverLogger";

interface Props {
    api: ReturnType<typeof useViolationApi>;
}

export default function ViolationHeader({ api }: Props) {
    const { createViolation, fetchViolations } = api;

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        form,
        errors,
        validateCreate,
        onChange,
        reset,
    } = useViolationForm();

    /* ================= CREATE ================= */

    const handleSubmit = async (): Promise<void> => {
        if (!validateCreate()) return;

        try {
            setSubmitting(true);

            await createViolation({
                name: form.name,
                point: form.point,
            });

            showSuccessToast("Pelanggaran berhasil ditambahkan");

            setOpen(false);
            reset();

            await fetchViolations();
        } catch (error: unknown) {
            serverLog("Create Violation Error", error);

            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Gagal menambahkan pelanggaran");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* HEADER ROW */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
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

            {/* CREATE MODAL */}
            <ViolationFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                title="Tambah Pelanggaran"
                subtitle="Lengkapi informasi pelanggaran dengan benar."
                form={form}
                onChange={onChange}
                errors={errors}
                loading={submitting}
                submitDisabled={submitting}
            />
        </>
    );
}