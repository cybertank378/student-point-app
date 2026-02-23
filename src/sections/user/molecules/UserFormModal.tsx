"use client";

import Image from "next/image";
import { FiX } from "react-icons/fi";

import { Modal } from "@/shared-ui/component/Modal";
import Switch from "@/shared-ui/component/Switch";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";
import { FormError } from "@/shared-ui/component/Form/FormError";
import { UploadButton } from "@/shared-ui/component/UploadButton";
import Divider from "@/shared-ui/component/Divider";

import {
    buildUserImagePath,
    TeacherRole,
    UserRole,
} from "@/libs/utils";

import {
    showErrorToast,
    showSuccessToast,
} from "@/shared-ui/component/Toast";

import { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
import { UserEntity } from "@/modules/user/domain/entity/UserEntity";

export interface UserFormType {
    password?: string;
    role: UserRole;
    teacherRole: TeacherRole | null;
    image?: string | null;
    isActive: boolean;
}

interface Props {
    api: ReturnType<typeof useUserApi>;
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: UserFormType;
    onChange: <K extends keyof UserFormType>(
        field: K,
        value: UserFormType[K]
    ) => void;
    mode: "add" | "edit";
    originalRole?: UserRole;
    user?: UserEntity | null;
    title?: string;
    subtitle?: string;
    loading?: boolean;
    errors?: Record<string, string[]>;
}

export default function UserFormModal({
                                          api,
                                          open,
                                          onClose,
                                          onSubmit,
                                          form,
                                          onChange,
                                          mode,
                                          originalRole,
                                          user,
                                          title,
                                          subtitle,
                                          loading = false,
                                          errors = {},
                                      }: Props) {
    const isAdd = mode === "add";
    const isRoleImmutable =
        mode === "edit" && originalRole === "STUDENT";

    const { uploadUserImage } = api;
    const userId = user?.id as string;

    const getError = (field: keyof UserFormType) =>
        errors?.[field]?.[0];

    /* ================= ROLE LABEL ================= */
    const ROLE_LABEL: Record<UserRole, string> = {
        ADMIN: "Admin",
        TEACHER: "Teacher",
        STUDENT: "Student",
        PARENT: "Parent",
    };

    const entityRole: UserRole = user?.role ?? form.role;
    const entityName = ROLE_LABEL[entityRole];

    /* ================= DISPLAY NAME ================= */
    const getDisplayName = (): string => {
        if (!user) return entityName;

        switch (user.role) {
            case "STUDENT":
                return `${user.student?.name ?? ""}${
                    user.student?.nis ? ` (NIS: ${user.student.nis})` : ""
                }`;

            case "TEACHER":
                return `${user.teacher?.name ?? ""}${
                    user.teacher?.nrg ? ` (NRG: ${user.teacher.nrg})` : ""
                }`;

            case "PARENT":
                return user.parent?.name ?? "";

            case "ADMIN":
                return user.username;

            default:
                return entityName;
        }
    };

    /* ================= DYNAMIC TITLE ================= */
    const dynamicTitle =
        title ??
        (isAdd
            ? `Tambah ${entityName}`
            : `Edit ${getDisplayName()}`);

    const dynamicSubtitle =
        subtitle ??
        (isAdd
            ? `Buat ${entityName.toLowerCase()} baru`
            : `Perbarui informasi ${entityName.toLowerCase()}`);

    /* ================= UPLOAD ================= */
    const handleUpload = async (
        file: File,
        onProgress: (percent: number) => void
    ) => {
        if (!userId) {
            showErrorToast("User belum dipilih.");
            throw new Error("User belum dipilih.");
        }

        try {
            onProgress(20);
            const result = await uploadUserImage(userId, file);

            if (!result.data) {
                showErrorToast(result.error?.message ?? "Upload gagal");
                return;
            }

            onChange("image", result.data.fileName);
            onProgress(100);
            showSuccessToast("Foto berhasil diupload");
        } catch (error) {
            showErrorToast(
                error instanceof Error
                    ? error.message
                    : "Upload gagal"
            );
            throw error;
        }
    };

    const showRelationSection =
        !isAdd &&
        user &&
        (user.role === "STUDENT" || user.role === "PARENT");

    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={onSubmit}
            title={dynamicTitle}
            subtitle={dynamicSubtitle}
            submitDisabled={loading}
            size="lg"
        >
            <div className="space-y-6">

                {/* PASSWORD & ROLE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <TextField
                            label={isAdd ? "Password" : "Password Baru"}
                            type="password"
                            value={form.password ?? ""}
                            onChange={(e) =>
                                onChange("password", e.target.value)
                            }
                            enablePasswordToggle
                            placeholder={
                                isAdd
                                    ? "Masukkan password"
                                    : "Kosongkan jika tidak diubah"
                            }
                            required={isAdd}
                            error={Boolean(getError("password"))}
                        />
                        <FormError message={getError("password")} />
                    </div>

                    <div className="space-y-2">
                        <SelectField
                            label="Role"
                            value={form.role}
                            disabled={isRoleImmutable}
                            onChange={(e) =>
                                onChange(
                                    "role",
                                    e.target.value as UserRole
                                )
                            }
                            error={Boolean(getError("role"))}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="STUDENT">Student</option>
                            <option value="PARENT">Parent</option>
                        </SelectField>
                        <FormError message={getError("role")} />
                    </div>
                </div>

                {/* RELATION + IMAGE */}
                {(showRelationSection || !isAdd) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                        {/* RELASI */}
                        {showRelationSection && (
                            <div className="border rounded-2xl p-6 bg-gray-50 h-full flex flex-col">
                                <h4 className="text-base font-semibold text-gray-800 mb-4">
                                    Informasi Relasi
                                </h4>

                                <div className="space-y-3 flex-1">
                                    {user.role === "STUDENT" &&
                                        user.student?.parents?.map((parent) => (
                                            <div
                                                key={parent.id}
                                                className="bg-white border border-gray-200 rounded-xl px-6 py-5"
                                            >
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {parent.name}
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs font-medium text-gray-500">
                                                        {parent.role}
                                                    </p>

                                                    <p className="text-sm text-gray-600 whitespace-nowrap">
                                                        {parent.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                    {user.role === "PARENT" &&
                                        user.parent?.students?.map((student) => (
                                            <div
                                                key={student.id}
                                                className="bg-white border border-gray-200 rounded-xl px-6 py-5"
                                            >
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {student.name}
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs font-medium text-gray-500">
                                                        {student.role}
                                                    </p>

                                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                                        NIS : {student.nis}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* FOTO */}
                        {!isAdd && (
                            <div className="border rounded-2xl p-6 bg-gray-50 min-h-[280px] flex flex-col">
                                <h4 className="text-base font-semibold text-gray-800 mb-6">
                                    Foto User
                                </h4>

                                {/* IMAGE */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <Image
                                            key={form.image}
                                            src={buildUserImagePath(form.role, form.image)}
                                            alt="Preview"
                                            width={90}
                                            height={90}
                                            className="object-cover rounded-full border-4 border-blue-500 bg-white shadow-sm"
                                        />

                                        {form.image && (
                                            <button
                                                type="button"
                                                onClick={() => onChange("image", null)}
                                                className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full shadow"
                                            >
                                                <FiX />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* BUTTON */}
                                <div className="mt-6">
                                    <UploadButton
                                        onUpload={handleUpload}
                                        hasImage={Boolean(form.image)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}