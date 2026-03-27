//Files: src/sections/Achievement/molecules/AchievementHeader.tsx
"use client";

import { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";

import Button from "@/shared-ui/component/Button";
import AchievementFormModal from "@/sections/achievement/organisms/AchievementFormModal";
import { useAchievementForm } from "@/modules/achievement/presentation/hooks/useAchievementForm";
import type { useAchievementApi } from "@/modules/achievement/presentation/hooks/useAchievementApi";
import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";
import { serverLog } from "@/libs/serverLogger";

interface Props {
    api: ReturnType<typeof useAchievementApi>;
}

export default function AchievementHeader({ api }: Props) {
    const { createAchievement, fetchAchievements } = api;

    const [open, setOpen] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {
        form,
        errors,
        validateCreate,
        onChange,
        reset,
    } = useAchievementForm();

    /* ================= CREATE ================= */

    const handleSubmit = async (): Promise<void> => {
        if (!validateCreate()) return;

        try {
            setSubmitting(true);

            await createAchievement({
                name: form.name.trim(),
                point: form.point,
            });

            showSuccessToast("Prestasi berhasil ditambahkan");

            setOpen(false);
            reset();

            await fetchAchievements();
        } catch (error: unknown) {
            serverLog("Create Achievement Error", error);

            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Gagal menambahkan prestasi");
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
                        Master Prestasi
                    </h1>
                    <p className="text-sm text-gray-500">
                        Daftar prestasi dan poin penghargaan siswa
                    </p>
                </div>

                <Button
                    leftIcon={HiPlusCircle}
                    onClick={() => setOpen(true)}
                >
                    Tambah Prestasi
                </Button>
            </div>

            {/* CREATE MODAL */}
            <AchievementFormModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                onChange={onChange}
                title="Tambah Prestasi"
                subtitle="Lengkapi informasi prestasi dengan benar."
                form={form}
                errors={errors}
                loading={submitting}
                submitDisabled={submitting}
            />
        </>
    );
}