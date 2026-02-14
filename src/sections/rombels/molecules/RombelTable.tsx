//Files: src/sections/rombels/molecules/RombelTable.tsx
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

import { Modal } from "@/shared-ui/component/Modal";
import Button from "@/shared-ui/component/Button";
import Loading from "@/shared-ui/component/Loading";

import { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import RombelFormModal from "@/sections/rombels/organisms/RombelFormModal";
import {useAcademicYearApi} from "@/modules/academic-year/presentation/hooks/useAcademicYearApi";


type Grade = "VII" | "VIII" | "IX";

/* =====================================
   FORM TYPES (STRICT + SAFE)
===================================== */
type RombelFormState = {
    grade: Grade;
    name: string;
    academicYearName: string;
};

type RombelFormField = keyof RombelFormState;

interface Props {
    api: ReturnType<typeof useRombelApi>;
}

export default function RombelTable({ api }: Props) {
    const {
        rombels,
        loading,
        error,
        createRombel,
        updateRombel,
        deleteRombel,
    } = api;

    const [editItem, setEditItem] = useState<Rombel | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const [form, setForm] = useState<RombelFormState>({
        grade: "VII",
        name: "",
        academicYearName: "",
    });

    const getLabel = (grade: Grade, name: string) => {
        return `${grade}.${name}`;
    };

    /* =====================================
       TYPE SAFE FORM CHANGE HANDLER
    ===================================== */
    const handleFormChange = <K extends RombelFormField>(
        field: K,
        value: RombelFormState[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* =====================================
       OPEN CREATE
    ===================================== */
    const handleOpenCreate = () => {
        setEditItem(null);
        setForm({
            grade: "VII",
            name: "",
            academicYearName: "",
        });
        setOpenForm(true);
    };

    /* =====================================
       EDIT
    ===================================== */
    const handleEdit = (item: Rombel) => {
        setEditItem(item);

        setForm({
            grade: item.grade as Grade,
            name: item.name,
            academicYearName: item.academicYearName ?? "",
        });

        setOpenForm(true);
    };

    /* =====================================
       SUBMIT
    ===================================== */
    const handleSubmit = async () => {
        if (!form.name) return;

        if (editItem) {
            const payload: UpdateRombelDTO = {
                id: editItem.id,
                ...form,
            };

            await updateRombel(payload);
        } else {
            const payload: CreateRombelDTO = {
                ...form,
            };

            await createRombel(payload);
        }

        setOpenForm(false);
        setEditItem(null);
    };

    /* =====================================
       DELETE
    ===================================== */
    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteRombel(deleteId);
        setDeleteId(null);
    };

    return (
        <>
            {/* ERROR */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error.message}
                </div>
            )}

            <Table wrapperClassName="rounded-xl shadow-sm overflow-hidden">
                <TableHead className="bg-gray-100 border-b h-16">
                    <tr>
                        <TableHeaderCell className="w-12 text-xs uppercase">
                            No
                        </TableHeaderCell>
                        <TableHeaderCell className="text-xs uppercase">
                            Kelas
                        </TableHeaderCell>
                        <TableHeaderCell className="text-xs uppercase">
                            Tingkat
                        </TableHeaderCell>
                        <TableHeaderCell className="text-xs uppercase">
                            Tahun Ajaran
                        </TableHeaderCell>
                        <TableHeaderCell className="text-xs uppercase">
                            Jumlah Siswa
                        </TableHeaderCell>
                        <TableHeaderCell className="text-xs uppercase">
                            Aksi
                        </TableHeaderCell>
                    </tr>
                </TableHead>

                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6}>
                            <div className="py-10">
                                <Loading />
                            </div>
                        </td>
                    </tr>
                ) : rombels.length === 0 ? (
                    <tr>
                        <td
                            colSpan={6}
                            className="text-center py-6 text-gray-500"
                        >
                            Tidak ada data master kelas
                        </td>
                    </tr>
                ) : (
                    rombels.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="text-gray-500 font-medium">
                                {index + 1}
                            </TableCell>

                            <TableCell className="font-medium">
                                {getLabel(
                                    item.grade as Grade,
                                    item.name
                                )}
                            </TableCell>

                            <TableCell>{item.grade}</TableCell>

                            <TableCell>
                                {item.academicYearName}
                            </TableCell>

                            <TableCell>
                                {item.studentCount} siswa
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="text"
                                        size="md"
                                        color="primary"
                                        leftIcon={FiEdit}
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    />

                                    <Button
                                        variant="text"
                                        size="md"
                                        color="error"
                                        leftIcon={FiTrash2}
                                        onClick={() =>
                                            setDeleteId(item.id)
                                        }
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
                </tbody>
            </Table>

            {/* FORM MODAL (USING RombelFormModal) */}
            <RombelFormModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmit}
                title={
                    editItem
                        ? "Edit Rombel"
                        : "Tambah Rombel"
                }
                subtitle={
                    editItem
                        ? "Perbarui informasi kelas yang dipilih."
                        : "Lengkapi informasi rombel dengan benar."
                }
                form={form}
                onChange={handleFormChange}
            />

            {/* DELETE MODAL */}
            <Modal
                title="Konfirmasi Hapus"
                subtitle="Tindakan ini tidak dapat dibatalkan."
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onSubmit={handleDelete}
                submitText="Hapus"
                submitColor="error"
                size="sm"
            >
                <div className="space-y-6 text-center">

                    {/* Icon Circle */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <div className="h-6 w-6 rounded-full bg-red-500" />
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Apakah Anda yakin ingin menghapus data ini?
                        <br />
                        Data yang dihapus tidak dapat dikembalikan.
                    </p>

                </div>
            </Modal>

        </>
    );
}




