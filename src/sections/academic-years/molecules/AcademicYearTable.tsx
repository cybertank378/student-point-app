//Files: src/sections/academic-years/molecules/AcademicYearTable.tsx
// Files: AcademicYearTable.tsx
"use client";

import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableCell,
} from "@/shared-ui/component/Table";

import { useAcademicYearApi } from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";

import AcademicYearModal from "@/sections/academic-years/organisms/AcademicYearModal";
import { Modal } from "@/shared-ui/component/Modal";
import Switch from "@/shared-ui/component/Switch";
import {dateFormater, parseDate} from "@/libs/utils";

interface FormState {
    name: string;
    startDate: string;
    endDate: string;
}

interface Props {
    api: ReturnType<typeof useAcademicYearApi>;
}

export default function AcademicYearTable({ api }: Props) {
    const {
        academicYears,
        updateAcademicYear,
        deleteAcademicYear,
        setActiveAcademicYear,
    } = api;

    const [editItem, setEditItem] =
        useState<AcademicYear | null>(null);

    const [deleteId, setDeleteId] =
        useState<string | null>(null);

    const [loadingId, setLoadingId] =
        useState<string | null>(null);

    const [form, setForm] = useState<FormState>({
        name: "",
        startDate: "",
        endDate: "",
    });

    /* ================= EDIT ================= */
    const handleEdit = (item: AcademicYear) => {
        setEditItem(item);

        setForm({
            name: item.name,
            startDate: dateFormater(item.startDate),
            endDate: dateFormater(item.endDate),
        });
    };

    /* ================= UPDATE ================= */
    const handleUpdate = async () => {
        if (!editItem) return;

        const payload: UpdateAcademicYearDTO = {
            id: editItem.id,
            name: form.name,
            startDate: parseDate(form.startDate),
            endDate: parseDate(form.endDate),
            isActive: editItem.isActive,
        };

        await updateAcademicYear(editItem.id, payload);
        setEditItem(null);
    };

    /* ================= SET ACTIVE ================= */
    const handleSetActive = async (
        id: string,
        isActive: boolean
    ) => {
        // Jika sudah aktif, tidak perlu apa-apa
        if (isActive) return;

        try {
            setLoadingId(id);
            await setActiveAcademicYear(id);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <Table wrapperClassName="rounded-xl shadow-sm">
                <TableHead>
                    <tr>
                        <TableHeaderCell>Nama</TableHeaderCell>
                        <TableHeaderCell>Mulai</TableHeaderCell>
                        <TableHeaderCell>Selesai</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                    </tr>
                </TableHead>

                <tbody>
                {academicYears.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>

                        <TableCell>
                            {dateFormater(item.startDate)}
                        </TableCell>

                        <TableCell>
                            {dateFormater(item.endDate)}
                        </TableCell>

                        {/* 🔥 SWITCH */}
                        <TableCell>
                            <Switch
                                label={
                                    item.isActive
                                        ? "Aktif"
                                        : "Nonaktif"
                                }
                                checked={item.isActive}
                                disabled={
                                    loadingId === item.id ||
                                    item.isActive
                                }
                                onChange={() =>
                                    handleSetActive(
                                        item.id,
                                        item.isActive
                                    )
                                }
                            />
                        </TableCell>

                        <TableCell>
                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        handleEdit(item)
                                    }
                                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <FiEdit />
                                </button>

                                <button
                                    onClick={() =>
                                        setDeleteId(item.id)
                                    }
                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                </tbody>
            </Table>

            {/* ================= EDIT MODAL ================= */}
            {editItem && (
                <AcademicYearModal
                    open={true}
                    onClose={() =>
                        setEditItem(null)
                    }
                    onSubmit={handleUpdate}
                    form={form}
                    onChange={(field, value) =>
                        setForm((prev) => ({
                            ...prev,
                            [field]: value,
                        }))
                    }
                    title="Edit Tahun Ajaran"
                />
            )}

            {/* ================= DELETE MODAL ================= */}
            <Modal
                title="Konfirmasi Hapus"
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onSubmit={async () => {
                    if (deleteId) {
                        await deleteAcademicYear(
                            deleteId
                        );
                    }
                    setDeleteId(null);
                }}
                submitText="Hapus"
                submitColor="error"
                size="sm"
            >
                <p className="text-sm text-gray-600">
                    Apakah Anda yakin ingin menghapus data ini?
                    Tindakan ini tidak dapat dibatalkan.
                </p>
            </Modal>
        </>
    );
}



