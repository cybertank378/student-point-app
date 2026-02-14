//Files: src/sections/violation/organisms/ViolationTabel.tsx
"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableCell,
} from "@/shared-ui/component/Table";

import Button from "@/shared-ui/component/Button";
import Loading from "@/shared-ui/component/Loading";
import { Modal } from "@/shared-ui/component/Modal";
import LevelBadge from "@/shared-ui/component/LevelBadge";
import Pagination from "@/shared-ui/component/Pagination";

import ViolationFormModal from "@/sections/violation/organisms/ViolationFormModal";
import { useViolationForm } from "@/modules/violation/presentation/hooks/useViolationForm";
import { useViolationMasterApi } from "@/modules/violation/presentation/hooks/useViolationApi";

import {
    showErrorToast,
    showSuccessToast,
} from "@/shared-ui/component/Toast";

import { Violation } from "@/modules/violation/domain/entity/Violation";

interface Props {
    api: ReturnType<typeof useViolationMasterApi>;
}

export default function ViolationTabel({ api }: Props) {

    const {
        violations,
        loading,
        deleteViolation,
        updateViolation,
    } = api;

    /* ================= LOCAL STATE ================= */
    const [localViolations, setLocalViolations] =
        useState<Violation[]>([]);

    const [deleteId, setDeleteId] =
        useState<string | null>(null);

    const [editItem, setEditItem] =
        useState<Violation | null>(null);

    const [openForm, setOpenForm] =
        useState(false);

    /* ================= PAGINATION ================= */
    const [currentPage, setCurrentPage] =
        useState(1);

    const itemsPerPage = 5;

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * itemsPerPage;

        return localViolations.slice(
            start,
            start + itemsPerPage
        );
    }, [localViolations, currentPage]);

    /* ================= SYNC API → LOCAL ================= */
    useEffect(() => {
        setLocalViolations(violations);
    }, [violations]);

    /* ================= FORM HOOK ================= */
    const {
        form,
        errors,
        isValid,
        validate,
        onChange,
        setForm,
    } = useViolationForm();

    /* ================= EDIT ================= */
    const handleEdit = (item: Violation) => {
        setEditItem(item);

        setForm({
            name: item.name,
            point: item.point,
            level: item.level,
        });

        setOpenForm(true);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {

        if (!validate() || !editItem) return;

        const original = [...localViolations];

        /* ===== Optimistic Update ===== */
        setLocalViolations((prev) =>
            prev.map((v) =>
                v.id === editItem.id
                    ? new Violation(
                        v.id,
                        form.name,
                        form.point,
                        form.level,
                        v.createdAt,
                        v.deletedAt
                    )
                    : v
            )
        );

        const result = await updateViolation({
            id: editItem.id,
            name: form.name,
            point: form.point,
            level: form.level,
        });

        if (!result) {
            setLocalViolations(original);
            showErrorToast("Gagal memperbarui pelanggaran");
            return;
        }

        showSuccessToast("Pelanggaran berhasil diperbarui");

        setOpenForm(false);
        setEditItem(null);
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {

        if (!deleteId) return;

        const original = [...localViolations];

        setLocalViolations((prev) =>
            prev.filter((v) => v.id !== deleteId)
        );

        try {

            await deleteViolation(deleteId);

            showSuccessToast(
                "Pelanggaran berhasil dihapus"
            );

        } catch {

            setLocalViolations(original);

            showErrorToast(
                "Gagal menghapus pelanggaran"
            );

        } finally {
            setDeleteId(null);
        }
    };

    return (
        <>
            <Table wrapperClassName="rounded-xl shadow-sm overflow-hidden">
                <TableHead className="bg-gray-100 border-b h-16">
                    <tr>
                        <TableHeaderCell>No</TableHeaderCell>
                        <TableHeaderCell>Nama</TableHeaderCell>
                        <TableHeaderCell>Poin</TableHeaderCell>
                        <TableHeaderCell>Level</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                    </tr>
                </TableHead>

                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={5}>
                            <div className="py-10">
                                <Loading />
                            </div>
                        </td>
                    </tr>
                ) : paginatedData.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            className="text-center py-6 text-gray-400"
                        >
                            Data tidak ditemukan
                        </td>
                    </tr>
                ) : (
                    paginatedData.map((v, index) => (
                        <TableRow key={v.id}>
                            <TableCell>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>

                            <TableCell>
                                {v.name}
                            </TableCell>

                            <TableCell className="font-semibold">
                                {v.point} poin
                            </TableCell>

                            <TableCell>
                                <LevelBadge level={v.level} />
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="text"
                                        color="primary"
                                        iconOnly
                                        leftIcon={FiEdit}
                                        onClick={() =>
                                            handleEdit(v)
                                        }
                                    />

                                    <Button
                                        variant="text"
                                        color="error"
                                        iconOnly
                                        leftIcon={FiTrash2}
                                        onClick={() =>
                                            setDeleteId(v.id)
                                        }
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
                </tbody>
            </Table>

            {/* ================= PAGINATION ================= */}
            <Pagination
                currentPage={currentPage}
                totalItems={localViolations.length}
                itemsPerPage={itemsPerPage}
                onPageChangeAction={setCurrentPage}
            />

            {/* ================= EDIT MODAL ================= */}
            <ViolationFormModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmit}
                title="Edit Pelanggaran"
                subtitle="Perbarui informasi pelanggaran"
                form={form}
                onChange={onChange}
                errors={errors}
                submitDisabled={!isValid}
            />

            {/* ================= DELETE MODAL ================= */}
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
                <p className="text-sm text-gray-600 text-center">
                    Data tidak dapat dikembalikan.
                </p>
            </Modal>
        </>
    );
}
