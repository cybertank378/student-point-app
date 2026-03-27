//Files: src/sections/rombels/organisms/RombelTable.tsx

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

import type { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";

import RombelFormModal from "@/sections/rombels/organisms/RombelFormModal";
import { formatClassLabel } from "@/libs/utils";

type Grade = "VII" | "VIII" | "IX";

type RombelFormState = {
    grade: Grade;
    name: string;
    academicYearId: string;
};

type RombelFormField = keyof RombelFormState;

interface Props {
    api: ReturnType<typeof useRombelApi>;
    academicYears: AcademicYear[];
}

export default function RombelTable({ api, academicYears }: Props) {

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
        academicYearId: "",
    });

    const resetForm = () => {
        setForm({
            grade: "VII",
            name: "",
            academicYearId: "",
        });
    };

    const handleFormChange = <K extends RombelFormField>(
        field: K,
        value: RombelFormState[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEdit = (item: Rombel) => {

        const year = academicYears.find(
            (y) => y.name === item.academicYearName
        );

        setEditItem(item);

        setForm({
            grade: item.grade as Grade,
            name: item.name,
            academicYearId: year?.id ?? "",
        });

        setOpenForm(true);
    };

    const handleSubmit = async () => {

        if (!form.name || !form.grade || !form.academicYearId) {
            return;
        }

        try {

            if (editItem) {

                const payload: UpdateRombelDTO = {
                    id: editItem.id,
                    grade: form.grade,
                    name: form.name,
                    academicYearId: form.academicYearId,
                };

                await updateRombel(payload);

            } else {

                const payload: CreateRombelDTO = {
                    grade: form.grade,
                    name: form.name,
                    academicYearId: form.academicYearId,
                };

                await createRombel(payload);
            }

            setOpenForm(false);
            setEditItem(null);
            resetForm();

        } catch (error) {

            console.error("Gagal menyimpan rombel:", error);

        }
    };

    const handleDelete = async () => {

        if (!deleteId) return;

        await deleteRombel(deleteId);

        setDeleteId(null);
    };

    return (
        <>
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error.message}
                </div>
            )}

            <Table wrapperClassName="rounded-xl shadow-sm overflow-hidden">

                <TableHead className="bg-gray-100 border-b h-16">
                    <tr>
                        <TableHeaderCell>No</TableHeaderCell>
                        <TableHeaderCell>Kelas</TableHeaderCell>
                        <TableHeaderCell>Tahun Ajaran</TableHeaderCell>
                        <TableHeaderCell>Jumlah Siswa</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                    </tr>
                </TableHead>

                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={5}>
                            <div className="py-10 text-center">
                                <Loading />
                            </div>
                        </td>
                    </tr>
                ) : rombels.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-500">
                            Tidak ada data master kelas
                        </td>
                    </tr>
                ) : (
                    rombels.map((item, index) => (
                        <TableRow key={item.id}>

                            <TableCell>{index + 1}</TableCell>

                            <TableCell className="font-medium">
                                {formatClassLabel(item.grade, item.name)}
                            </TableCell>

                            <TableCell>{item.academicYearName}</TableCell>

                            <TableCell>{item.studentCount} siswa</TableCell>

                            <TableCell>
                                <div className="flex gap-2">

                                    <Button
                                        variant="text"
                                        size="md"
                                        color="primary"
                                        leftIcon={FiEdit}
                                        onClick={() => handleEdit(item)}
                                    />

                                    <Button
                                        variant="text"
                                        size="md"
                                        color="error"
                                        leftIcon={FiTrash2}
                                        onClick={() => setDeleteId(item.id)}
                                    />

                                </div>
                            </TableCell>

                        </TableRow>
                    ))
                )}
                </tbody>
            </Table>

            <RombelFormModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmit}
                title={editItem ? "Edit Rombel" : "Tambah Rombel"}
                subtitle="Lengkapi informasi rombel"
                form={form}
                academicYears={academicYears}
                onChange={handleFormChange}
            />

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
                <div className="text-center text-sm text-gray-600">
                    Apakah Anda yakin ingin menghapus rombel ini?
                </div>
            </Modal>
        </>
    );
}