"use client";

import Image from "next/image";

import {showErrorToast, showSuccessToast,} from "@/shared-ui/component/Toast";

import {Modal} from "@/shared-ui/component/Modal";
import Switch from "@/shared-ui/component/Switch";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";
import {FormError} from "@/shared-ui/component/Form/FormError";
import {UploadButton} from "@/shared-ui/component/UploadButton";

import {buildUserImagePath, TeacherRole, UserRole,} from "@/libs/utils";

import {useUserApi} from "@/modules/user/presentation/hooks/useUserApi";
import {UserEntity} from "@/modules/user/domain/entity/UserEntity";
import {FiX} from "react-icons/fi";
import Divider from "@/shared-ui/component/Divider";

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

    const {uploadUserImage} = api;
    const userId = user?.id as string;

    const getError = (field: keyof UserFormType) =>
        errors?.[field]?.[0];

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
            title={title ?? (isAdd ? "Tambah User" : "Edit User")}
            subtitle={
                subtitle ??
                (isAdd
                    ? "Buat user baru"
                    : "Perbarui informasi user")
            }
            submitDisabled={loading}
            size="lg"
        >
            <div className="space-y-6">

                {/* ================= PASSWORD & ROLE ================= */}
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
                        <FormError message={getError("password")}/>
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
                        <FormError message={getError("role")}/>
                    </div>
                </div>

                {/* ================= RELATION + IMAGE ================= */}
                {(showRelationSection || !isAdd) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* ===== RELASI ===== */}
                        {showRelationSection && (
                            <div className="border rounded-2xl p-8 bg-gray-50 h-full">
                                <h4 className="text-base font-semibold text-gray-800 mb-6">
                                    Informasi Relasi
                                </h4>

                                <div className="space-y-4">
                                    {user.role === "STUDENT" &&
                                        user.student?.parents?.map((parent) => (
                                            <div
                                                key={parent.id}
                                                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-5"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {parent.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {parent.role}
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-600 whitespace-nowrap">
                                                    {parent.phone}
                                                </p>
                                            </div>
                                        ))}

                                    {user.role === "PARENT" &&
                                        user.parent?.students?.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-5"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        NIS : {student.nis}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {student.role}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* ===== FOTO  ===== */}
                        {!isAdd && (
                            <div className="border rounded-2xl p-8 bg-gray-50 flex flex-col h-full">
                                <h4 className="text-base font-semibold text-gray-800 mb-6">
                                    Foto User
                                </h4>

                                {/* FOTO DI TENGAH */}
                                <div className="flex items-center justify-center flex-1">
                                    <div className="relative w-80 h-80">
                                        <Image
                                            key={form.image}   // 🔥 penting
                                            src={buildUserImagePath(form.role, form.image)}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-full border-solid border-blue-500  bg-white shadow-sm"
                                        />

                                        {form.image && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onChange("image", null)
                                                }
                                                className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full shadow"
                                            >
                                                <FiX />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* BUTTON DI BAWAH */}
                                <div className="pt-6">
                                    <UploadButton
                                        onUpload={handleUpload}
                                        hasImage={Boolean(form.image)}
                                    />
                                </div>
                            </div>

                        )}
                    </div>
                )}


                {/* ================= STATUS ================= */}
                {!isAdd && (
                    <div className="space-y-3">
                        <Divider />
                        <Switch
                            label="Status Aktif"
                            checked={form.isActive}
                            onChange={(e) =>
                                onChange("isActive", e.target.checked)
                            }
                        />
                    </div>

                )}
            </div>
        </Modal>
    );
}
