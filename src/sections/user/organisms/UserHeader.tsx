//Files: src/sections/user/organisms/UserHeader.tsx
"use client";

import { useEffect, useState } from "react";
import SelectField from "@/shared-ui/component/SelectField";
import SearchField from "@/shared-ui/component/SearchField";
import Button from "@/shared-ui/component/Button";
import { FaPlus } from "react-icons/fa";

import type { useUserApi } from "@/modules/user/presentation/hooks/useUserApi";
import type { UserRole } from "@/libs/utils";

import UserFormModal, {
    UserFormType,
} from "@/sections/user/molecules/UserFormModal";

import { CreateUserDTO } from "@/modules/user/domain/dto/CreateUserDTO";

interface Props {
    api: ReturnType<typeof useUserApi>;
}

export default function UserHeader({ api }: Props) {
    const { searchUsers, create } = api;

    /* ================= FILTER STATE ================= */
    const [search, setSearch] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

    /* ================= MODAL STATE ================= */
    const [open, setOpen] = useState<boolean>(false);

    /* ================= FORM STATE (MATCHES UserFormType) ================= */
    const [form, setForm] = useState<UserFormType>({
        password: "",
        role: "STUDENT",
        teacherRole: null,
        image: null,
        isActive: true,
    });

    /* ================= SEARCH TRIGGER ================= */
    useEffect(() => {
        void searchUsers({
            username: search || undefined,
            role:
                roleFilter !== "ALL" ? roleFilter : undefined,
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
        K extends keyof UserFormType
    >(
        field: K,
        value: UserFormType[K]
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
                UserRole,
                "ADMIN"
            >,
            referenceId: "", // isi sesuai kebutuhan sistem
            ...(form.role === "TEACHER" &&
                form.teacherRole && {
                    teacherRole: form.teacherRole,
                }),
        };

        await create(payload);
        setOpen(false);
    };

    return (
        <>
            <div className="bg-transparent">
                <div className="px-8 py-6 bg-white">
                    <h3 className="text-base font-semibold text-gray-700 mb-6">
                        Filters
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* ROLE FILTER */}
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

                        {/* STATUS FILTER */}
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

                        {/* SEARCH */}
                        <SearchField
                            className="flex justify-end"
                            value={search}
                            onChange={setSearch}
                            placeholder="Search User"
                            debounce={400}
                        />

                        {/* ADD BUTTON */}
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
                form={form}
                onChange={handleChange}
            />
        </>
    );
}