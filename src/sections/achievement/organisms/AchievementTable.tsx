//Files: src/sections/achievement/organisms/AchievementTable.tsx
"use client";

import { useEffect, useState } from "react";

import {
    Table,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@/shared-ui/component/Table";

import Loading from "@/shared-ui/component/Loading";
import Pagination from "@/shared-ui/component/Pagination";
import { Modal } from "@/shared-ui/component/Modal";
import { Chip } from "@/shared-ui/component/Chip";
import Button from "@/shared-ui/component/Button";

import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";
import type { useAchievementApi } from "@/modules/achievement/presentation/hooks/useAchievementApi";

import AchievementFormModal from "@/sections/achievement/organisms/AchievementFormModal";

interface Props {
    api: ReturnType<typeof useAchievementApi>;
}

export default function AchievementTable({ api }: Props) {
    const {
        achievements,
        pagination,
        loading,
        fetchAchievements,
        deleteAchievement,
        updateAchievement,
    } = api;

    const [selectedAchievement, setSelectedAchievement] =
        useState<Achievement | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [search] = useState("");

    const [form, setForm] = useState({
        name: "",
        point: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const currentPage = pagination?.page ?? 1;
    const itemsPerPage = pagination?.limit ?? 10;
    const totalItems = pagination?.total ?? 0;

    /* ================= HANDLE CHANGE ================= */

    const handleChange = (
        field: "name" | "point",
        value: string | number
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    /* ================= UPDATE ================= */

    const handleSubmitEdit = async () => {
        if (!selectedAchievement) return;

        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
        if (!form.point || form.point <= 0)
            newErrors.point = "Poin harus lebih dari 0";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await updateAchievement({
            id: selectedAchievement.id,
            name: form.name.trim(),
            point: form.point,
        });

        setIsEditOpen(false);
        setSelectedAchievement(null);

        await fetchAchievements({
            page: currentPage,
            limit: itemsPerPage,
            search,
        });
    };

    /* ================= DELETE ================= */

    const handleDelete = async () => {
        if (!deleteId) return;

        await deleteAchievement(deleteId);

        setDeleteId(null);

        await fetchAchievements({
            page: currentPage,
            limit: itemsPerPage,
            search,
        });
    };

    /* ================= FETCH ================= */

    useEffect(() => {
        void fetchAchievements({
            page: currentPage,
            limit: itemsPerPage,
            search,
        });
    }, [currentPage, itemsPerPage, search, fetchAchievements]);

    /* ================= RENDER ================= */

    return (
        <>
            <div className="bg-white border shadow-sm overflow-hidden">
                <Table>
                    {/* HEADER */}
                    <TableHead className="uppercase text-xs tracking-wide">
                        <TableRow className="hover:bg-transparent">
                            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
                                Nama
                            </TableHeaderCell>

                            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
                                Poin
                            </TableHeaderCell>

                            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
                                Status
                            </TableHeaderCell>

                            <TableHeaderCell className="uppercase tracking-wider text-xs font-semibold text-gray-600">
                                Action
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-10 text-center">
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    ) : achievements.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-400">
                                Tidak ada data prestasi.
                            </td>
                        </tr>
                    ) : (
                        achievements.map((item) => {
                            const isActive = item.deletedAt === null;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>

                                    <TableCell>{item.point}</TableCell>

                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            className={
                                                isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }
                                        >
                                            {isActive ? "Active" : "Inactive"}
                                        </Chip>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="text"
                                                color="success"
                                                iconOnly
                                                shape="circle"
                                                leftIcon={FaPenToSquare}
                                                onClick={() => {
                                                    setSelectedAchievement(item);

                                                    setForm({
                                                        name: item.name,
                                                        point: item.point,
                                                    });

                                                    setErrors({});
                                                    setIsEditOpen(true);
                                                }}
                                            />

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="text"
                                                color="error"
                                                iconOnly
                                                shape="circle"
                                                leftIcon={FaTrash}
                                                onClick={() => setDeleteId(item.id)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                    </tbody>
                </Table>

                {/* PAGINATION */}
                <div className="flex justify-end px-6 py-4 border-t">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChangeAction={(page) =>
                            fetchAchievements({
                                page,
                                limit: itemsPerPage,
                                search,
                            })
                        }
                    />
                </div>
            </div>

            {/* DELETE MODAL */}
            <Modal
                title="Konfirmasi Hapus"
                subtitle="Tindakan ini tidak dapat dibatalkan."
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onSubmit={handleDelete}
                submitText="Hapus"
                submitColor="error"
                size="sm"
            >
                <p className="text-sm text-gray-600 text-center">
                    Data prestasi akan dihapus permanen.
                </p>
            </Modal>

            {/* EDIT MODAL */}
            <AchievementFormModal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedAchievement(null);
                    setErrors({});
                }}
                onSubmit={handleSubmitEdit}
                onChange={handleChange}
                title="Edit Prestasi"
                subtitle="Perbarui data prestasi"
                form={form}
                errors={errors}
            />
        </>
    );
}