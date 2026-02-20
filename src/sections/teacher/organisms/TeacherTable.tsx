//Files: src/sections/teacher/organisms/TeacherTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
    FaEye,
    FaTrash,
    FaPenToSquare,
} from "react-icons/fa6";

import { Chip } from "@/shared-ui/component/Chip";
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableCell,
} from "@/shared-ui/component/Table";

import Pagination from "@/shared-ui/component/Pagination";
import { Modal } from "@/shared-ui/component/Modal";
import Loading from "@/shared-ui/component/Loading";

import { useTeacherApi } from "@/modules/teacher/presentation/hooks/useTeacherApi";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";

import {
    getPnsStatus,
    getReligionName,
    teacherRoleLabel,
} from "@/libs/utils";

import TeacherFormModal, {TeacherFormType} from "@/sections/teacher/molecules/TeacherFormModal";
import {showErrorToast, showSuccessToast} from "@/shared-ui/component/Toast";

interface Props {
    api: ReturnType<typeof useTeacherApi>;
}

export default function TeacherTable({ api }: Props) {
    const { teachers, fetchTeachers, getTeacherById, updateTeacher, deleteTeacher,loading } = api;

    /* ================= PAGINATION ================= */

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    /* ================= MODAL STATE ================= */

    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedTeacherName, setSelectedTeacherName] =
        useState<string>("");

    const [deleteId, setDeleteId] =
        useState<string | null>(null);

    const [formLoading, setFormLoading] =
        useState(false);

    /* ================= FORM STATE ================= */

    const initialForm: TeacherFormType = {
        name: "",
        gender: "MALE",
        religionCode: "",
        email: null,
        phone: null,
        roles: [],
        isPns: false,
        photo: null,
        nip: null,
        nuptk: null,
        nrk: null,
        nrg: null,
        educationLevel: "S1",
        major: null,
        graduationYear: new Date().getFullYear(),
        birthPlace: "",
        birthDate: new Date(),
        civilServantRank: null,
    };

    const [form, setForm] =
        useState<TeacherFormType>(initialForm);

    /* ================= FETCH LIST ================= */

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            const result = await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });

            if (mounted && result) {
                setTotalItems(result.total);
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [currentPage, itemsPerPage, fetchTeachers]);

    /* ================= HANDLE EDIT ================= */

    const handleEdit = (id: string, name: string) => {
        setEditingId(id);
        setSelectedTeacherName(name);
        setEditOpen(true);
    };

    /* ================= FETCH DETAIL ================= */

    useEffect(() => {
        if (!editOpen || !editingId) return;

        const fetchDetail = async () => {
            setFormLoading(true);

            const teacher = await getTeacherById(editingId);

            if (teacher) {
                setForm({
                    name: teacher.name,
                    gender: teacher.gender,
                    religionCode: teacher.religionCode,
                    email: teacher.email ?? null,
                    phone: teacher.phone ?? null,
                    roles: [...teacher.roles],
                    isPns: teacher.isPns,
                    photo: teacher.photo ?? null,
                    nip: teacher.nip ?? null,
                    nuptk: teacher.nuptk ?? null,
                    nrk: teacher.nrk ?? null,
                    nrg: teacher.nrg ? String(teacher.nrg) : null,
                    educationLevel: teacher.educationLevel,
                    major: teacher.major ?? null,
                    graduationYear: teacher.graduationYear,
                    birthPlace: teacher.birthPlace,
                    birthDate: new Date(teacher.birthDate),
                    civilServantRank:
                        teacher.civilServantRank ?? null,
                });
            }

            setFormLoading(false);
        };

        void fetchDetail();
    }, [editOpen, editingId, getTeacherById]);

    /* ================= HANDLE CHANGE ================= */

    const handleChange = <
        K extends keyof TeacherFormType
    >(
        field: K,
        value: TeacherFormType[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* ================= UPDATE ================= */

    const handleUpdate = async () => {
        if (!editingId) return;

        const payload: UpdateTeacherDTO = {
            id: editingId,
            ...form,
            nrg: form.nrg ? Number(form.nrg) : undefined,
        };

        const updated = await updateTeacher(payload);

        if (updated) {
            showSuccessToast("Data guru berhasil diperbarui.");

            setEditOpen(false);
            setEditingId(null);
            setForm(initialForm);

            await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });
        } else {
            showErrorToast("Gagal memperbarui data guru.");
        }
    };

    /* ================= DELETE ================= */

    const handleDelete = async () => {
        if (!deleteId) return;

        const success =
            await deleteTeacher(deleteId);

        if (success) {
            showSuccessToast("Data guru berhasil dihapus.");

            setDeleteId(null);

            await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });
        } else {
            showErrorToast("Gagal menghapus data guru.");
        }
    };

    /* ================= RENDER ================= */

    return (
        <>
            <div className="bg-white border shadow-sm overflow-hidden">
                {loading && (
                    <div className="p-4">
                        <Loading />
                    </div>
                )}

                <Table>
                    {/* HEADER */}
                    <TableHead className="uppercase text-xs tracking-wide">
                        <TableRow className="hover:bg-transparent">
                            <TableHeaderCell> <input type="checkbox" /></TableHeaderCell>
                            <TableHeaderCell>Nama Guru</TableHeaderCell>
                            <TableHeaderCell>Email</TableHeaderCell>
                            <TableHeaderCell>Status Pegawai</TableHeaderCell>
                            <TableHeaderCell>Agama</TableHeaderCell>
                            <TableHeaderCell>Role</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <tbody>
                    {teachers.map((teacher) => {
                        const isActive =
                            teacher.email !==
                            null;

                        return (
                            <TableRow
                                key={teacher.id}
                            >
                                <TableCell><input type="checkbox" /></TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                                            {teacher.name
                                                .split(" ")
                                                .map((n) =>n[0])
                                                .join("")
                                                .slice(0,2)
                                            }
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {teacher.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {teacher.nip}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="text-gray-600">
                                    {teacher.email ??
                                        "-"}
                                </TableCell>

                                <TableCell className="text-gray-600">
                                    {getPnsStatus(teacher.isPns)}
                                </TableCell>

                                <TableCell className="text-gray-600">
                                    {getReligionName( teacher.religionCode ) ?? "-"}
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-2 flex-wrap">
                                        {teacher.roles.map(
                                            (role ) => (
                                                <Chip
                                                    key={role}
                                                    size="sm"
                                                    variant="soft"
                                                >
                                                    {teacherRoleLabel[role]}
                                                </Chip>
                                            )
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <button
                                            className="p-1 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            title="View"
                                        >
                                            <FaEye size={ 14 } className="text-blue-500"/>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleEdit(teacher.id,teacher.name)
                                            }
                                            className="p-1 rounded hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                            title="Edit"
                                        >
                                            <FaPenToSquare size={14} className="text-green-500"/>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setDeleteId(teacher.id )
                                            }
                                            className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Remove"
                                        >
                                            <FaTrash size={14} className="text-red-500"/>
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </tbody>
                </Table>

                {/* PAGINATION */}
                <div className="flex justify-end px-6 py-4 border-t">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChangeAction={
                            setCurrentPage
                        }
                    />
                </div>
            </div>

            {/* EDIT MODAL */}
            <TeacherFormModal
                open={editOpen}
                onClose={() =>
                    setEditOpen(false)
                }
                onSubmit={handleUpdate}
                mode="edit"
                title="Edit Guru"
                subtitle={`Data: ${selectedTeacherName}`}
                form={form}
                onChange={handleChange}
                loading={formLoading}
            />

            {/* DELETE MODAL */}
            <Modal
                title="Konfirmasi Hapus"
                subtitle="Tindakan ini tidak dapat dibatalkan."
                open={Boolean(deleteId)}
                onClose={() =>
                    setDeleteId(null)
                }
                onSubmit={handleDelete}
                submitText="Hapus"
                submitColor="error"
                size="sm"
            >
                <p className="text-sm text-gray-600 text-center">
                    Data guru akan dihapus permanen.
                </p>
            </Modal>
        </>
    );
}


