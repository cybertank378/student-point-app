//Files: src/sections/rombels/organisms/RombelFormModal.tsx
"use client";

import { Modal } from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import { formatClassLabel } from "@/libs/utils";

import type { ChangeEvent } from "react";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    subtitle: string;

    form: {
        grade: "VII" | "VIII" | "IX";
        name: string;
        academicYearId: string;
    };

    academicYears: AcademicYear[];

    onChange: (
        field: "grade" | "name" | "academicYearId",
        value: string
    ) => void;
}

export default function RombelFormModal({
                                            open,
                                            onClose,
                                            onSubmit,
                                            title,
                                            subtitle,
                                            form,
                                            academicYears,
                                            onChange,
                                        }: Props) {

    const preview = formatClassLabel(
        form.grade,
        form.name || "X"
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={onSubmit}
            title={title}
            subtitle={subtitle}
            submitText="Simpan"
            size="lg"
        >
            <div className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <SelectField
                        label="Tingkat"
                        value={form.grade}
                        onChange={(e) =>
                            onChange("grade", e.target.value)
                        }
                    >
                        <option value="VII">VII</option>
                        <option value="VIII">VIII</option>
                        <option value="IX">IX</option>
                    </SelectField>

                    <TextField
                        label="Nama Kelas"
                        placeholder="Contoh: A"
                        value={form.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            onChange(
                                "name",
                                e.target.value.toUpperCase()
                            )
                        }
                    />

                    <SelectField
                        label="Tahun Ajaran"
                        value={form.academicYearId}
                        onChange={(e) =>
                            onChange("academicYearId", e.target.value)
                        }
                        className="md:col-span-2"
                    >
                        <option value="">
                            -- Pilih Tahun Ajaran --
                        </option>

                        {academicYears.map((year) => (
                            <option
                                key={year.id}
                                value={year.id}
                            >
                                {year.name}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6 text-center">
                    <p className="text-xs uppercase text-indigo-500 mb-2">
                        Preview Label
                    </p>

                    <p className="text-3xl font-semibold text-gray-700">
                        {preview}
                    </p>
                </div>
            </div>
        </Modal>
    );
}