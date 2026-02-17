"use client";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";

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
import UserFormModal from "@/sections/user/molecules/UserFormModal";
import Pagination from "@/shared-ui/component/Pagination";

import {
    showErrorToast,
    showSuccessToast,
} from "@/shared-ui/component/Toast";

import type { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";

import {
    buildUserImagePath,
    getDisplayName,
    getIdentityNumber,
} from "@/libs/utils";

import Avatar from "@/shared-ui/component/Avatar";
import RoleBadge from "@/shared-ui/component/RoleBadge";
import { getFieldErrors } from "@/modules/shared/errors/errorUtils";
import { handleApiErrorToast } from "@/shared-ui/component/toastHandler";

interface Props {
    api: ReturnType<typeof useUserApi>;
}

type EditUserForm = Omit<UpdateUserDTO, "id">;

export default function UserTable({ api }: Props) {
    const { users, list, remove, update, loading, error } = api;

    /* ================= PAGINATION ================= */
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    /* ================= MODAL STATES ================= */
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<UserEntity | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    const [form, setForm] = useState<EditUserForm>({
        password: "",
        role: "STUDENT",
        teacherRole: null,
        image: "",
        isActive: true,
    });

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        let mounted = true;

        const fetchUsers = async () => {
            const result = await list({
                page: currentPage,
                limit: itemsPerPage,
            });

            if (mounted && result) {
                setTotalItems(result.total);
            }
        };

        void fetchUsers();

        return () => {
            mounted = false;
        };
    }, [currentPage, itemsPerPage, list]);


    /* ================= EDIT ================= */
    const handleEdit = (user: UserEntity) => {
        setEditingUserId(user.id);
        setEditingUser(user);

        setForm({
            password: "",
            role: user.role,
            teacherRole: user.teacherRole ?? null,
            isActive: user.isActive,
            image: user.image ?? null,
        });

        setEditOpen(true);
    };

    const handleChange = <K extends keyof EditUserForm>(
        field: K,
        value: EditUserForm[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* ================= UPDATE ================= */
    const handleUpdate = async () => {
        if (!editingUserId) return;

        setFormErrors({});

        const payload: UpdateUserDTO = {
            id: editingUserId,
            role: form.role,
            teacherRole:
                form.role === "TEACHER"
                    ? form.teacherRole ?? null
                    : null,
            isActive: form.isActive,
            ...(form.image ? { image: form.image } : {}),
            ...(form.password?.trim()
                ? { password: form.password.trim() }
                : {}),
        };

        const result = await update(editingUserId, payload);

        if (result.data) {
            showSuccessToast("User berhasil diperbarui");
            setEditOpen(false);

            await list({
                page: currentPage,
                limit: itemsPerPage,
            });

            return;
        }

        const fieldErrors = getFieldErrors(result.error);

        if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(fieldErrors);
            return;
        }

        handleApiErrorToast(result.error);
    };

    /* ================= DELETE ================= */
    const handleDelete = async () => {
        if (!deleteId) return;

        const success = await remove(deleteId);

        if (success) {
            showSuccessToast("User berhasil dihapus");

            await list({
                page: currentPage,
                limit: itemsPerPage,
            });
        } else {
            showErrorToast(
                error?.message ?? "Gagal menghapus user"
            );
        }

        setDeleteId(null);
    };

    /* ================= RENDER ================= */
    return (
        <>
            <div className="relative mt-6">
                <Table wrapperClassName="shadow-sm overflow-hidden">
                    <TableHead className="bg-gray-100 border-b h-16">
                        <tr>
                            <TableHeaderCell>No</TableHeaderCell>
                            <TableHeaderCell>User</TableHeaderCell>
                            <TableHeaderCell>Role</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
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
                    ) : users.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center py-6 text-gray-400"
                            >
                                Data tidak ditemukan
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => {
                            const displayName = getDisplayName(user);
                            const identityNumber =
                                getIdentityNumber(user);

                            return (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={displayName}
                                                image={
                                                    buildUserImagePath(
                                                        user.role,
                                                        user.image
                                                    ) ?? null
                                                }
                                                size="sm"
                                            />

                                            <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-gray-800">
                                                        {displayName}
                                                    </span>
                                                <span className="text-xs text-gray-400">
                                                        {identityNumber}
                                                    </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <RoleBadge
                                            role={user.role}
                                            variant="soft"
                                            size="sm"
                                        />
                                    </TableCell>

                                    <TableCell>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    user.isActive
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {user.isActive
                                                    ? "Aktif"
                                                    : "Nonaktif"}
                                            </span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="text"
                                                color="primary"
                                                iconOnly
                                                leftIcon={FiEdit}
                                                onClick={() =>
                                                    handleEdit(user)
                                                }
                                            />

                                            <Button
                                                variant="text"
                                                color="error"
                                                iconOnly
                                                leftIcon={FiTrash2}
                                                onClick={() =>
                                                    setDeleteId(user.id)
                                                }
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
                        onPageChangeAction={setCurrentPage}
                    />
                </div>
            </div>

            {/* DELETE MODAL */}
            <Modal
                title="Konfirmasi Hapus"
                subtitle="Tindakan ini tidak dapat dibatalkan."
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                onSubmit={handleDelete}
                submitText="Hapus"
                submitColor="error"
                size="sm"
            >
                <p className="text-sm text-gray-600 text-center">
                    Data user akan dihapus permanen.
                </p>
            </Modal>

            {/* EDIT MODAL */}
            <UserFormModal
                api={api}
                user={editingUser}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={handleUpdate}
                mode="edit"
                form={form}
                onChange={handleChange}
                errors={formErrors}
                title="Edit User"
            />
        </>
    );
}
