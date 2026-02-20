//Files: src/sections/violation/organisms/ViolationTabel.tsx
"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";

import {
    Table,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@/shared-ui/component/Table";

import Button from "@/shared-ui/component/Button";
import Loading from "@/shared-ui/component/Loading";
import { Modal } from "@/shared-ui/component/Modal";
import LevelBadge from "@/shared-ui/component/LevelBadge";
import Pagination from "@/shared-ui/component/Pagination";

import ViolationFormModal from "@/sections/violation/organisms/ViolationFormModal";
import { useViolationForm } from "@/modules/violation/presentation/hooks/useViolationForm";

import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import FilterBar from "@/shared-ui/component/FilterBar";
import type { ViolationLevel } from "@/generated/prisma";
import SelectField from "@/shared-ui/component/SelectField";
import SearchField from "@/shared-ui/component/SearchField";
import { useViolationApi } from "@/modules/violation/presentation/hooks/useViolationApi";
import { serverLog } from "@/libs/serverLogger";

interface Props {
    api: ReturnType<typeof useViolationApi>;
}

export default function ViolationTabel({ api }: Props) {
    const {
        violations,
        pagination,
        loading,
        fetchViolations,
        deleteViolation,
        updateViolation,
    } = api;

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Violation | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [search, setSearch] = useState("");
    const [filterLevel, setFilterLevel] =
        useState<ViolationLevel | "ALL">("ALL");

    const currentPage = pagination?.page ?? 1;
    const itemsPerPage = pagination?.limit ?? 10;

    /* ================= FETCH ================= */

    useEffect(() => {
        fetchViolations({
            page: currentPage,
            limit: itemsPerPage,
            search,
        });
    }, [currentPage, itemsPerPage, search, fetchViolations]);

    /* ================= FORM ================= */

    const {
        form,
        errors,
        validateUpdate,
        onChange,
        setForm,
        reset,
    } = useViolationForm();

    /* ================= EDIT ================= */

    const handleEdit = (item: Violation): void => {
        reset();
        setEditItem(item);

        setForm({
            name: item.name,
            point: item.point,
            level: item.level,
        });

        setOpenForm(true);
    };

    /* ================= UPDATE ================= */

    const handleSubmit = async (): Promise<void> => {
        if (!validateUpdate() || !editItem) return;

        try {
            setSubmitting(true);

            await updateViolation(editItem.id, {
                name: form.name,
                point: form.point,
            });

            showSuccessToast("Pelanggaran berhasil diperbarui");

            setOpenForm(false);
            setEditItem(null);

            await fetchViolations({
                page: currentPage,
                limit: itemsPerPage,
                search,
            });
        } catch (error: unknown) {
            serverLog("Update Violation Error", error);

            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Gagal memperbarui pelanggaran");
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= DELETE ================= */

    const handleDelete = async (): Promise<void> => {
        if (!deleteId) return;

        try {
            await deleteViolation(deleteId);

            showSuccessToast("Pelanggaran berhasil dihapus");

            await fetchViolations({
                page: currentPage,
                limit: itemsPerPage,
                search,
            });
        } catch (error: unknown) {
            serverLog("Delete Violation Error", error);

            if (error instanceof Error) {
                showErrorToast(error.message);
            } else {
                showErrorToast("Gagal menghapus pelanggaran");
            }
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <>
            <FilterBar>
                <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Cari pelanggaran..."
                    debounce={400}
                />

                <div className="w-48">
                    <SelectField
                        value={filterLevel}
                        onChange={(e) =>
                            setFilterLevel(
                                e.target.value as ViolationLevel | "ALL",
                            )
                        }
                    >
                        <option value="ALL">Semua Level</option>
                        <option value="LIGHT">Ringan</option>
                        <option value="MEDIUM">Sedang</option>
                        <option value="HEAVY">Berat</option>
                    </SelectField>
                </div>
            </FilterBar>

            <Table>
                <TableHead>
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
                            <Loading />
                        </td>
                    </tr>
                ) : violations.length === 0 ? (
                    <tr>
                        <td colSpan={5}>Data tidak ditemukan</td>
                    </tr>
                ) : (
                    violations.map((v, index) => (
                        <TableRow key={v.id}>
                            <TableCell>
                                {(currentPage - 1) *
                                    itemsPerPage +
                                    index +
                                    1}
                            </TableCell>

                            <TableCell>{v.name}</TableCell>

                            <TableCell>{v.point}</TableCell>

                            <TableCell>
                                <LevelBadge level={v.level} />
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="text"
                                        size="md"
                                        color="primary"
                                        leftIcon={FiEdit}
                                        iconOnly
                                        onClick={() =>
                                            handleEdit(v)
                                        }
                                    />

                                    <Button
                                        variant="text"
                                        size="md"
                                        color="error"
                                        leftIcon={FiTrash2}
                                        iconOnly
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

            <Pagination
                currentPage={currentPage}
                totalItems={pagination?.total ?? 0}
                itemsPerPage={itemsPerPage}
                onPageChangeAction={(page) =>
                    fetchViolations({
                        page,
                        limit: itemsPerPage,
                        search,
                    })
                }
            />

            <ViolationFormModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleSubmit}
                title="Edit Pelanggaran"
                subtitle="Perbarui informasi pelanggaran"
                form={form}
                onChange={onChange}
                errors={errors}
                loading={submitting}
                submitDisabled={submitting}
            />

            <Modal
                title="Konfirmasi Hapus"
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onSubmit={handleDelete}
            >
                <p>Data tidak dapat dikembalikan.</p>
            </Modal>
        </>
    );
}