//Files: src/sections/teacher/organisms/TeacherTable.tsx
"use client";

import {useEffect, useMemo, useState} from "react";
import {FaEllipsisVertical, FaEye, FaPenToSquare, FaTrash,} from "react-icons/fa6";

import {Chip} from "@/shared-ui/component/Chip";
import {Table, TableCell, TableHead, TableHeaderCell, TableRow,} from "@/shared-ui/component/Table";

import Pagination from "@/shared-ui/component/Pagination";
import {Modal} from "@/shared-ui/component/Modal";
import Loading from "@/shared-ui/component/Loading";

import {useTeacherApi} from "@/modules/teacher/presentation/hooks/useTeacherApi";

import {buildUserImagePath, getPnsStatus, getReligionName, teacherRoleLabel,} from "@/libs/utils";

import TeacherFormModal, {TeacherFormType} from "@/sections/teacher/molecules/TeacherFormModal";
import {showErrorToast, showSuccessToast} from "@/shared-ui/component/Toast";
import {buildDynamicPatch} from "@/modules/shared/utils/buildDynamicPatch";
import {TeacherRespDTO} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";
import Avatar from "@/shared-ui/component/Avatar";
import BulkActionBar from "@/shared-ui/component/BulkActionBar";
import Checkbox from "@/shared-ui/component/Checkbox";
import {TeacherRole} from "@/generated/prisma";
import {useRombelApi} from "@/modules/rombel/presentation/hooks/useRombelApi";

interface Props {
    api: ReturnType<typeof useTeacherApi>;
}

export default function TeacherTable({api}: Props) {
    const {
        teachers,
        fetchTeachers,
        getTeacherById,
        updateTeacher,
        deleteTeacher,
        assignTeacherRole,
        assignHomeroom,
        loading,
    } = api;

    const rombelApi = useRombelApi();

    /* ================= PAGINATION ================= */

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    /* ================= MODAL STATE ================= */

    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTeacher, setEditingTeacher] =  useState<TeacherRespDTO | null>(null);
    const [selectedTeacherName, setSelectedTeacherName] = useState<string>("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [originalTeacher, setOriginalTeacher] =useState<TeacherFormType | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    /* ================= ROLE OPTIONS ================= */

    const teacherRoleOptions = useMemo(
        () =>
            Object.values(TeacherRole).map((role) => ({
                label: teacherRoleLabel[role],
                value: role,
            })),
        []
    );

    /* ================= ROMBEL OPTIONS ================= */

    const rombelOptions = useMemo(
        () =>
            rombelApi.rombels
                .sort((a, b) => {
                    if (a.grade === b.grade) {
                        return Number(a.name) - Number(b.name);
                    }
                    return a.grade.localeCompare(b.grade);
                })
                .map((r) => ({
                    label: `${r.grade} - ${r.name}`,
                    value: r.id,
                })),
        [rombelApi.rombels]
    );
    /* ================= BULK ACTION HANDLERS ================= */
    const handleAssignRoles = async (roles: TeacherRole[]) => {
        if (selectedIds.length === 0) return;

        try {
            const result = await assignTeacherRole({
                teacherIds: selectedIds,
                roles,
            });

            if (!result) {
                showErrorToast("Gagal assign role");
                return;
            }

            showSuccessToast("Role berhasil diassign");

            setSelectedIds([]);
            await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });

        } catch {
            showErrorToast("Terjadi kesalahan saat assign role");
        }
    };

    const handleAssignHomeroom = async (rombelIds: string[]) => {
        if (selectedIds.length === 0) return;

        try {
            const result = await assignHomeroom({
                teacherIds: selectedIds,
                rombelIds,
            });

            if (!result) {
                showErrorToast("Gagal assign homeroom");
                return;
            }

            showSuccessToast("Homeroom berhasil diassign");

            setSelectedIds([]);
            await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });

        } catch {
            showErrorToast("Terjadi kesalahan saat assign homeroom");
        }
    };


    /* ================= SELECTION ================= */

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const currentPageIds = teachers.map((t) => t.id);

        const allSelected = currentPageIds.every((id) =>
            selectedIds.includes(id)
        );

        if (allSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !currentPageIds.includes(id))
            );
        } else {
            setSelectedIds((prev) => [
                ...new Set([...prev, ...currentPageIds]),
            ]);
        }
    };

    /* ================= FORM ================= */

    const initialForm: TeacherFormType = {
        name: "",
        gender: "MALE",
        religionCode: "",
        email: "",
        phone: "",
        roles: [],
        isPns: false,
        photo: "",
        nip: "",
        nuptk: "",
        nrk: "",
        nrg: "",
        educationLevel: "S1",
        major: "",
        graduationYear: new Date().getFullYear(),
        birthPlace: "",
        birthDate: new Date(),
        civilServantRank: null,
    };

    const [form, setForm] = useState<TeacherFormType>(initialForm);

    /* ================= FETCH LIST ================= */

    useEffect(() => {
        const load = async () => {
            const result = await fetchTeachers({
                page: currentPage,
                limit: itemsPerPage,
            });

            if (result) {
                setTotalItems(result.total);
            }
        };

        void load();
    }, [currentPage, itemsPerPage, fetchTeachers]);

    /* ================= DTO → FORM ================= */

    const mapTeacherToForm = (
        teacher: TeacherRespDTO
    ): TeacherFormType => ({
        name: teacher.name,
        gender: teacher.gender,
        religionCode: teacher.religionCode,
        email: teacher.email ?? "",
        phone: teacher.phone ?? "",
        roles: [...teacher.roles], // FIX readonly
        isPns: teacher.isPns,
        photo: teacher.photo ?? "",
        nip: teacher.nip ?? "",
        nuptk: teacher.nuptk ?? "",
        nrk: teacher.nrk ?? "",
        nrg: teacher.nrg ?? "",
        educationLevel: teacher.educationLevel,
        major: teacher.major ?? "",
        graduationYear: teacher.graduationYear,
        birthPlace: teacher.birthPlace,
        birthDate: new Date(teacher.birthDate),
        civilServantRank: teacher.civilServantRank ?? null,
    });

    /* ================= HANDLE EDIT ================= */

    const handleEdit = async (teacher: TeacherRespDTO) => {
        setEditOpen(true);
        setFormLoading(true);

        const detail = await getTeacherById(teacher.id);

        if (!detail) {
            showErrorToast("Gagal mengambil detail guru");
            setFormLoading(false);
            return;
        }

        const mapped = mapTeacherToForm(detail);

        setEditingTeacher(detail);
        setEditingId(detail.id);
        setSelectedTeacherName(detail.name);
        setForm(mapped);
        setOriginalTeacher(mapped);

        setFormLoading(false);
    };

    const handleChange = <K extends keyof TeacherFormType>(
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
        if (!editingId || !originalTeacher) return;

        setFormLoading(true);

        console.log("DATA Origin", originalTeacher.photo)
        console.log("DATA CHANGE", form.photo)

        const payload = buildDynamicPatch(
            editingId,
            form,
            originalTeacher,
            [
                {
                    when: (form) => form.isPns,
                    include: [
                        "nip",
                        "nrk",
                        "nuptk",
                        "nrg",
                        "civilServantRank",
                    ],
                },
                {
                    when: (form, original) =>
                        original.isPns && !form.isPns,
                    setNull: [
                        "nip",
                        "nrk",
                        "nuptk",
                        "civilServantRank",
                    ],
                },
            ]
        );

        console.log("data payload:",payload)
        const updated = await updateTeacher(payload);

        setFormLoading(false);

        if (updated) {
            showSuccessToast("Data guru berhasil diperbarui.");

            setEditOpen(false);
            setEditingId(null);
            setOriginalTeacher(null);
            setEditingTeacher(null);

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

        const success = await deleteTeacher(deleteId);

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
                {/* BULK ACTION BAR */}
                {selectedIds.length > 0 && (
                    <div className="p-4">
                        <BulkActionBar
                            count={selectedIds.length}
                            label="guru dipilih"
                            onClear={() => setSelectedIds([])}
                            panels={[
                                {
                                    key: "role",
                                    toggleText: "Assign Role",
                                    confirmText: "Confirm Assign Role",
                                    options: teacherRoleOptions,
                                    confirmColor: "info",
                                    onConfirm: handleAssignRoles,
                                },
                                {
                                    key: "homeroom",
                                    toggleText: "Assign Homeroom",
                                    confirmText: "Confirm Assign Homeroom",
                                    options: rombelOptions,
                                    confirmColor: "primary",
                                    onConfirm: handleAssignHomeroom,
                                },
                            ]}
                        />
                    </div>
                )}

                <Table>
                    {/* HEADER */}
                    <TableHead className="uppercase text-xs tracking-wide">
                        <TableRow className="hover:bg-transparent">
                            <TableHeaderCell>
                                <Checkbox
                                    checked={
                                        teachers.length > 0 &&
                                        teachers.every((t) =>
                                            selectedIds.includes(t.id)
                                        )
                                    }
                                    indeterminate={
                                        teachers.some((t) =>
                                            selectedIds.includes(t.id)
                                        ) &&
                                        !teachers.every((t) =>
                                            selectedIds.includes(t.id)
                                        )
                                    }
                                    onChange={handleSelectAll}
                                />
                            </TableHeaderCell>
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
                    {loading ? (
                        <tr>
                            <td colSpan={8}>
                                <div className="py-10 text-center">
                                    <Loading/>
                                </div>
                            </td>
                        </tr>
                    ) : teachers.length === 0 ? (
                        <tr>
                            <td
                                colSpan={8}
                                className="text-center py-6 text-gray-400"
                            >
                                Tidak ada data guru.
                            </td>
                        </tr>
                    ) : (
                        teachers.map((teacher) => {
                            const isActive = teacher.email !== null;

                            return (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(teacher.id)}
                                            onChange={() => toggleSelect(teacher.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={teacher.name}
                                                image={
                                                    buildUserImagePath(
                                                        "Teacher",
                                                        teacher.photo
                                                    ) ?? null
                                                }
                                                size="sm"
                                            />
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
                                        {teacher.email ?? "-"}
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {getPnsStatus(teacher.isPns)}
                                    </TableCell>

                                    <TableCell className="text-gray-600">
                                        {getReligionName(teacher.religionCode) ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {teacher.roles.map((role) => (
                                                <Chip key={role} size="sm" variant="soft">
                                                    {teacherRoleLabel[role]}
                                                </Chip>
                                            ))}
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
                                            {isActive ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="relative flex items-center justify-end gap-4 text-gray-500">
                                            {/* VIEW */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("View:", teacher.id);
                                                }}
                                                className="p-1 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <FaEye size={14} className="text-blue-500" />
                                            </button>

                                            {/* EDIT */}
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(teacher)}
                                                className="p-1 rounded hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                            >
                                                <FaPenToSquare size={14} className="text-green-500" />
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                type="button"
                                                onClick={() => setDeleteId(teacher.id)}
                                                className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <FaTrash size={14} className="text-red-500" />
                                            </button>

                                            {/* 3 DOT MENU */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(
                                                            openMenuId === teacher.id ? null : teacher.id
                                                        );
                                                    }}
                                                    className="p-2 rounded hover:bg-gray-100 transition"
                                                >
                                                    <FaEllipsisVertical
                                                        size={16}
                                                        className="text-gray-600"
                                                    />
                                                </button>

                                                {/* DROPDOWN */}
                                                {openMenuId === teacher.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                                                        <button
                                                            onClick={() => handleEdit(teacher)}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => setDeleteId(teacher.id)}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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

            {/* EDIT MODAL */}


            <TeacherFormModal
                api={api}
                open={editOpen}
                teacher={editingTeacher}
                onClose={() => {
                    setEditOpen(false);
                    setEditingId(null);
                    setOriginalTeacher(null);
                    setEditingTeacher(null);
                }}
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
                onClose={() => setDeleteId(null)}
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