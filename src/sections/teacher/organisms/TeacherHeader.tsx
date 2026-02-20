//Files: src/sections/teacher/organisms/TeacherHeader.tsx
"use client";

import { useEffect, useState } from "react";
import SelectField from "@/shared-ui/component/SelectField";
import SearchField from "@/shared-ui/component/SearchField";
import Button from "@/shared-ui/component/Button";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";

import TeacherFormModal, {
    TeacherFormType,
} from "@/sections/teacher/molecules/TeacherFormModal";

import type { useTeacherApi } from "@/modules/teacher/presentation/hooks/useTeacherApi";
import { useReligionApi } from "@/modules/religion/presentation/hooks/useReligionApi";
import { teacherRoleLabel } from "@/libs/utils";
import { showSuccessToast, showErrorToast } from "@/shared-ui/component/Toast";

interface Props {
    api: ReturnType<typeof useTeacherApi>;
}

export default function TeacherHeader({ api }: Props) {
    const { searchTeachers, createTeacher } = api;

    const { religions, loading: religionLoading } = useReligionApi();

    /* ================= FILTER STATE ================= */
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<string>("");
    const [religionCode, setReligionCode] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    /* ================= MODAL STATE ================= */
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<TeacherFormType>({
        nip: "",
        nuptk: "",
        nrk: "",
        nrg: "",
        name: "",
        gender: "MALE", // default
        religionCode: "",
        phone: "",
        email: "",
        photo: "",
        educationLevel: "S1",
        major: "",
        graduationYear: new Date().getFullYear(),
        birthPlace: "",
        birthDate: new Date(),
        civilServantRank: null,
        roles: [],
        isPns: false,
    });

    const handleChange = <K extends keyof TeacherFormType>(
        field: K,
        value: TeacherFormType[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /* ================= SUBMIT CREATE ================= */
    const handleSubmit = async () => {
        try {
            const result = await createTeacher({
                nip: form.nip || null,
                nuptk: form.nuptk || null,
                nrk: form.nrk || null,
                nrg: form.nrg ? Number(form.nrg) : undefined,

                name: form.name,
                gender: form.gender,

                religionCode: form.religionCode,

                phone: form.phone || null,
                email: form.email || null,
                photo: form.photo || null,

                educationLevel: form.educationLevel,
                major: form.major || null,
                graduationYear: form.graduationYear,

                birthPlace: form.birthPlace,
                birthDate: form.birthDate,

                civilServantRank: form.civilServantRank || null,

                roles: form.roles,
                isPns: form.isPns ?? false
            });

            if (!result) {
                showErrorToast("Gagal menambahkan guru");
                return;
            }

            showSuccessToast("Guru berhasil ditambahkan");

            setOpen(false);

            setForm({
                nip: "",
                nuptk: "",
                nrk: "",
                nrg: "",
                name: "",
                gender: "MALE",
                religionCode: "",
                phone: "",
                email: "",
                photo: "",
                educationLevel: "S1",
                major: "",
                graduationYear: new Date().getFullYear(),
                birthPlace: "",
                birthDate: new Date(),
                civilServantRank: null,
                roles: [],
                isPns: false,
            });

            await searchTeachers({
                search: search || undefined,
                role: role || undefined,
                religionCode: religionCode || undefined,
                page: 1,
                limit: 10,
            });

        } catch {
            showErrorToast("Terjadi kesalahan");
        }
    };


    /* ================= AUTO SEARCH ================= */
    useEffect(() => {
        void searchTeachers({
            search: search || undefined,
            role: role || undefined,
            religionCode: religionCode || undefined,
            page: 1,
            limit: 10,
        });
    }, [search, role, religionCode, status, searchTeachers]);

    return (
        <>
            <div className="bg-transparent overflow-hidden">

                {/* ================= FILTER SECTION ================= */}
                <div className="px-8 py-6 space-y-6">
                    <h3 className="text-base font-semibold text-gray-700">
                        Filters
                    </h3>

                    <div className="grid grid-cols-3 gap-6">

                        <SelectField
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Pilih Role</option>
                            {Object.entries(teacherRoleLabel).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            value={religionCode}
                            onChange={(e) => setReligionCode(e.target.value)}
                            disabled={religionLoading}
                        >
                            <option value="">
                                {religionLoading ? "Memuat..." : "Pilih Agama"}
                            </option>

                            {religions.map((religion) => (
                                <option key={religion.id} value={religion.id}>
                                    {religion.name}
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Pilih Status</option>
                            <option value="ACTIVE">Aktif</option>
                            <option value="INACTIVE">Nonaktif</option>
                        </SelectField>

                    </div>
                </div>

                <div className="border-t" />

                {/* ================= ACTION SECTION ================= */}
                <div className="px-8 py-5 flex items-center justify-between">
                    <Button variant="outline" leftIcon={HiOutlineUpload}>
                        Export
                    </Button>

                    <div className="flex items-center gap-4">
                        <SearchField
                            value={search}
                            onChange={setSearch}
                            placeholder="Cari Guru"
                            className="w-72"
                            debounce={400}
                        />

                        {/* 🔥 FIXED TRIGGER */}
                        <Button
                            variant="filled"
                            color="primary"
                            leftIcon={FaPlus}
                            onClick={() => setOpen(true)}
                        >
                            Tambah Guru
                        </Button>

                    </div>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            <TeacherFormModal
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


