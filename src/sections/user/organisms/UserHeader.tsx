"use client";

import { useEffect, useState } from "react";
import SelectField from "@/shared-ui/component/SelectField";
import SearchField from "@/shared-ui/component/SearchField";
import Button from "@/shared-ui/component/Button";
import { FaPlus } from "react-icons/fa";

import type { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
import type {TeacherRole, UserRole} from "@/libs/utils";

import UserFormModal from "@/sections/user/molecules/UserFormModal";
import {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";

interface Props {
    api: ReturnType<typeof useUserApi>;
}

type CreateForm = {
    password: string;
    role: UserRole;
    teacherRole: TeacherRole | null;
    image: File | null;
    referenceId: string;
    isActive: boolean;
};

export default function UserHeader({ api }: Props) {
    const { searchUsers } = api;
    const [search, setSearch] = useState<string>("");
    const [roleFilter, setRoleFilter] =
        useState<"ALL" | UserRole>("ALL");
    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "ACTIVE" | "INACTIVE">(
            "ALL"
        );

    /* ================= MODAL STATE ================= */

    const [open, setOpen] = useState<boolean>(false);

    const [form, setForm] = useState<CreateForm>({
        password: "",
        role: "STUDENT",
        teacherRole: null,
        image: null,
        referenceId: "",
        isActive: true,
    });

    /* ================= SEARCH TRIGGER ================= */

    useEffect(() => {
        void searchUsers({
            username: search || undefined,
            role: roleFilter !== "ALL" ? roleFilter : undefined,
            isActive:
                statusFilter === "ALL"
                    ? undefined
                    : statusFilter === "ACTIVE",
            page: 1,
            limit: 10,
        });
    }, [search, roleFilter, statusFilter, searchUsers]);

    /* ================= FORM CHANGE ================= */

    const handleChange = <
        K extends keyof CreateForm
    >(
        field: K,
        value: CreateForm[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* ================= SUBMIT ================= */


    const handleSubmit = async () => {
        if (form.role === "ADMIN") return;

        const payload: CreateUserDTO = {
            role: form.role as Exclude<
                typeof form.role,
                "ADMIN"
            >,
            referenceId: form.referenceId,
            ...(form.role === "TEACHER" &&
                form.teacherRole && {
                    teacherRole: form.teacherRole,
                }),
        };

        await api.create(payload);
    };

    return (
        <>
            <div className="bg-transparent">
                <div className="px-8 py-6 bg-white">
                    <h3 className="text-base font-semibold text-gray-700 mb-6">
                        Filters
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-end-safe">
                        {/* Select Role */}
                        <SelectField
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(
                                    e.target.value as "ALL" | UserRole
                                )
                            }
                        >
                            <option value="ALL">Select Role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="PARENT">Parent</option>
                        </SelectField>

                        {/* Select Status */}
                        <SelectField
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as
                                        | "ALL"
                                        | "ACTIVE"
                                        | "INACTIVE"
                                )
                            }
                        >
                            <option value="ALL">Select Status</option>
                            <option value="ACTIVE">Aktif</option>
                            <option value="INACTIVE">Nonaktif</option>
                        </SelectField>

                        {/* Search */}
                        <SearchField
                            className="flex justify-end"
                            value={search}
                            onChange={setSearch}
                            placeholder="Search User"
                            debounce={400}
                        />

                        {/* Add Button */}
                        <div className="flex justify-end">
                            <Button
                                variant="filled"
                                color="primary"
                                leftIcon={FaPlus}
                                onClick={() => setOpen(true)}
                            >
                                Add User
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= CREATE MODAL ================= */}

            <UserFormModal
                api={api}
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                mode="add"
                form={{
                    password: "",
                    role: form.role,
                    teacherRole: form.teacherRole,
                    image: "",
                    isActive: true,
                }}
                onChange={(field, value) => {
                    if (field === "role") {
                        handleChange(
                            "role",
                            value as UserRole
                        );
                    }

                    if (field === "teacherRole") {
                        handleChange(
                            "teacherRole",
                            value as TeacherRole | null
                        );
                    }
                }}
            />
        </>
    );
}
