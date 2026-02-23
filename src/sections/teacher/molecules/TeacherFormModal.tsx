"use client";

import Image from "next/image";
import {FiX} from "react-icons/fi";

import {Modal} from "@/shared-ui/component/Modal";
import Switch from "@/shared-ui/component/Switch";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";
import {UploadButton} from "@/shared-ui/component/UploadButton";
import Divider from "@/shared-ui/component/Divider";

import {buildUserImagePath, getCivilServantRankLabel, teacherRoleLabel} from "@/libs/utils";

import {showErrorToast, showSuccessToast,} from "@/shared-ui/component/Toast";

import {useTeacherApi} from "@/modules/teacher/presentation/hooks/useTeacherApi";

import {CivilServantRank, EducationLevel, Gender, TeacherRole,} from "@/generated/prisma";
import CheckboxGroup from "@/shared-ui/component/CheckboxGroup";
import {useReligionApi} from "@/modules/religion/presentation/hooks/useReligionApi";
import {useState} from "react";
import {TeacherFormSchema} from "@/modules/teacher/infrastructure/validators/teacherForm.validator";
import {TeacherRespDTO} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

/* =========================================================
   FORM TYPE
========================================================= */

export interface TeacherFormType {
    name: string;
    gender: Gender;
    religionCode: string;

    phone?: string | null;
    email?: string | null;
    photo?: string | null;

    educationLevel: EducationLevel;
    major?: string | null;
    graduationYear: number;

    birthPlace: string;
    birthDate: Date;

    nrg: string;
    nuptk?: string | null;
    nip?: string | null;
    nrk?: string | null;

    isPns: boolean;
    civilServantRank?: CivilServantRank | null;

    roles: TeacherRole[];
}

interface Props {
    api: ReturnType<typeof useTeacherApi>;
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: TeacherFormType;
    onChange: <K extends keyof TeacherFormType>(
        field: K,
        value: TeacherFormType[K]
    ) => void;
    mode: "add" | "edit";
    teacher: TeacherRespDTO | null;
    title?: string;
    subtitle?: string;
    loading?: boolean;
    errors?: Record<string, string[]>;
}

export default function TeacherFormModal({
                                             api,
                                             open,
                                             onClose,
                                             onSubmit,
                                             form,
                                             onChange,
                                             mode,
                                             teacher,
                                             title,
                                             subtitle,
                                             loading = false,
                                         }: Props) {
    const {religions} = useReligionApi();

    const isAdd = mode === "add";
    const teacherId = teacher?.id as string;

    const {uploadTeacherImage} = api;


    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const dynamicTitle =
        title ??
        (isAdd
            ? "Tambah Teacher"
            : `Edit ${teacher?.name ?? "Teacher"}`);

    const dynamicSubtitle =
        subtitle ??
        (isAdd
            ? "Buat data teacher baru"
            : "Perbarui informasi teacher ");


    /* =========================================================
      VALIDATION (ZOD V4 SAFE)
   ========================================================= */

    const validateForm = (): boolean => {
        const result = TeacherFormSchema.safeParse(form);

        if (!result.success) {
            const formatted: Record<string, string> = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0];

                if (typeof field === "string" && !formatted[field]) {
                    formatted[field] = issue.message;
                }
            }

            setFieldErrors(formatted);

            // Scroll + Focus first error
            setTimeout(() => {
                const firstKey = Object.keys(formatted)[0];
                if (!firstKey) return;

                const el = document.querySelector(
                    `[data-field="${firstKey}"]`
                ) as HTMLElement | null;

                if (!el) return;

                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                el.focus();
            }, 100);

            return false;
        }

        setFieldErrors({});
        return true;
    };


    /* ================= UPLOAD ================= */

    const handleUpload = async (
        file: File,
        onProgress: (percent: number) => void
    ) => {
        if (!teacherId) {
            showErrorToast("Guru belum dipilih.");
            throw new Error("Guru belum dipilih.");
        }

        try {
            onProgress(20);
            const result = await uploadTeacherImage(teacherId, file);

            if (!result.data) {
                showErrorToast(result.error?.message ?? "Upload gagal");
                return;
            }

            console.log("UPLOAD DATA ",result.data.fileName);

            onChange("photo", result.data.fileName);
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


    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={() => {
                if (!validateForm()) return;
                onSubmit();
            }}
            title={dynamicTitle}
            subtitle={dynamicSubtitle}
            submitDisabled={loading}
            size="xl"
        >
            <div className="space-y-10">
                {/* ================================================== */}
                {/* IDENTITAS DASAR */}
                {/* ================================================== */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Identitas Dasar
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                        {/* ================= FOTO ================= */}
                        <div className="md:row-span-3">
                            <div className="border rounded-2xl p-6 bg-gray-50 flex flex-col items-center h-full">

                                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                                    Foto Guru
                                </h4>

                                <div className="relative w-40 h-40 mb-6">
                                    {form.photo ? (
                                        <>
                                            <Image
                                                key={form.photo}
                                                src={buildUserImagePath("Teacher", form.photo)}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded-full border-4 border-blue-500 bg-white shadow-sm"
                                                unoptimized
                                            />

                                            <button
                                                type="button"
                                                onClick={() => onChange("photo", null)}
                                                className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full shadow"
                                            >
                                                <FiX />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm border">
                                            No Photo
                                        </div>
                                    )}
                                </div>

                                <UploadButton
                                    onUpload={handleUpload}
                                    hasImage={Boolean(form.photo)}
                                />
                            </div>
                        </div>

                        {/* ================= ROW 1 ================= */}
                        <TextField
                            name="name"
                            label="Nama Lengkap"
                            value={form.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            required
                            error={fieldErrors.name}

                        />

                        <SelectField
                            name="gender"
                            label="Jenis Kelamin"
                            value={form.gender}
                            onChange={(e) =>
                                onChange("gender", e.target.value as Gender)
                            }
                            error={fieldErrors.gender}
                        >
                            <option value={Gender.MALE}>Laki-laki</option>
                            <option value={Gender.FEMALE}>Perempuan</option>
                        </SelectField>

                        <SelectField
                            name="religionCode"
                            label="Agama"
                            value={form.religionCode}
                            onChange={(e) =>
                                onChange("religionCode", e.target.value)
                            }
                            error={fieldErrors.religionCode}
                        >
                            <option value="">Pilih Agama</option>
                            {religions.map((religion) => (
                                <option key={religion.kode} value={religion.kode}>
                                    {religion.name}
                                </option>
                            ))}
                        </SelectField>

                        {/* ================= ROW 2 ================= */}
                        <TextField
                            name="email"
                            label="Email"
                            value={form.email ?? ""}
                            onChange={(e) =>
                                onChange("email", e.target.value)
                            }
                            error={fieldErrors.email}
                        />

                        <TextField
                            name="phone"
                            label="No. Telepon"
                            value={form.phone ?? ""}
                            onChange={(e) =>
                                onChange("phone", e.target.value)
                            }
                            error={fieldErrors.phone}
                        />

                        {/* Empty slot supaya tetap 4 kolom */}
                        <div className="hidden md:block"/>

                        {/* ================= ROW 3 ================= */}
                        <div className="md:col-span-3">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                Peran Guru
                            </h4>

                            <CheckboxGroup
                                options={Object.values(TeacherRole).map((role) => ({
                                    label: teacherRoleLabel[role],
                                    value: role,
                                }))}
                                direction="horizontal"
                                value={form.roles}
                                onChange={(vals) =>
                                    onChange("roles", vals as TeacherRole[])
                                }
                            />
                        </div>

                    </div>


                </div>


                <Divider/>
                {/* ====================================================== */}
                {/* DATA PRIBADI + PENDIDIKAN (SIDE BY SIDE) */}
                {/* ====================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* ================= DATA PRIBADI (LEFT) ================= */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Data Pribadi
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <TextField
                                name="birthPlace"
                                label="Tempat Lahir"
                                value={form.birthPlace}
                                onChange={(e) =>
                                    onChange("birthPlace", e.target.value)
                                }
                                error={fieldErrors.birthPlace}
                            />

                            <TextField
                                name="birthDate"
                                label="Tanggal Lahir"
                                type="date"
                                value={
                                    form.birthDate
                                        ? form.birthDate.toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={(e) =>
                                    onChange(
                                        "birthDate",
                                        new Date(e.target.value)
                                    )
                                }
                                error={fieldErrors.birthDate}
                            />
                        </div>
                    </div>


                    {/* ================= PENDIDIKAN (RIGHT) ================= */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Pendidikan
                        </h3>

                        <div className="space-y-6">

                            {/* Pendidikan Terakhir - Full Width */}
                            <SelectField
                                name="educationLevel"
                                label="Pendidikan Terakhir"
                                value={form.educationLevel}
                                onChange={(e) =>
                                    onChange(
                                        "educationLevel",
                                        e.target.value as EducationLevel
                                    )
                                }
                                error={fieldErrors.educationLevel}
                            >
                                {Object.values(EducationLevel).map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </SelectField>

                            {/* Jurusan + Tahun Lulus Horizontal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    name="major"
                                    label="Jurusan"
                                    value={form.major ?? ""}
                                    onChange={(e) =>
                                        onChange("major", e.target.value)
                                    }
                                    error={fieldErrors.major}
                                />

                                <TextField
                                    name="graduationYear"
                                    label="Tahun Lulus"
                                    type="number"
                                    value={form.graduationYear}
                                    onChange={(e) =>
                                        onChange(
                                            "graduationYear",
                                            Number(e.target.value)
                                        )
                                    }
                                    error={fieldErrors.graduationYear}
                                />
                            </div>

                        </div>
                    </div>

                </div>

                <Divider/>


                {/* ====================================================== */}
                {/* 5️⃣ STATUS KEPEGAWAIAN */}
                {/* ====================================================== */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Status Kepegawaian
                    </h3>

                    {/* ROW 1: PNS + NRG */}
                    <div className="grid md:grid-cols-2 gap-6 items-end">

                        {/* PNS SECTION */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Pegawai Negeri Sipil (PNS)
                                </p>
                                <p className="text-xs text-gray-500">
                                    Aktifkan jika guru merupakan PNS
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <Switch
                                    name="isPns"
                                    checked={form.isPns}
                                    onChange={(checked) => onChange("isPns", checked)}
                                />
                                <span
                                    className={`text-sm font-semibold transition-colors duration-300 ${
                                        form.isPns ? "text-blue-600" : "text-gray-600"
                                    }`}
                                >
                                    {form.isPns ? "PNS" : "Non PNS"}
                                </span>
                            </div>

                        </div>

                        {/* NRG */}
                        <TextField
                            name="nrg"
                            label="NRG"
                            value={form.nrg ?? ""}
                            type="number"
                            onChange={(e) => onChange("nrg", e.target.value)}
                            maxLengthValue={12}
                            minLengthValue={3}
                            showCounter
                            required
                            error={fieldErrors.nrg}
                        />
                    </div>

                    {/* FIELD KHUSUS PNS */}
                    {form.isPns && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">

                            <SelectField
                                name="civilServantRank"
                                label="Golongan PNS"
                                value={form.civilServantRank ?? ""}
                                onChange={(e) =>
                                    onChange(
                                        "civilServantRank",
                                        e.target.value
                                            ? (e.target.value as CivilServantRank)
                                            : null
                                    )
                                }
                                error={fieldErrors.civilServantRank}
                            >
                                <option value="">Pilih Golongan</option>

                                {Object.values(CivilServantRank).map((rank) => (
                                    <option key={rank} value={rank}>
                                        {getCivilServantRankLabel(rank)}
                                    </option>
                                ))}
                            </SelectField>

                            <TextField
                                name="nip"
                                label="NIP"
                                value={form.nip ?? ""}
                                onChange={(e) => onChange("nip", e.target.value)}
                                error={fieldErrors.nip}

                            />

                            <TextField
                                name="nuptk"
                                label="NUPTK"
                                value={form.nuptk ?? ""}
                                onChange={(e) => onChange("nuptk", e.target.value)}
                                error={fieldErrors.nuptk}
                            />

                            <TextField
                                name="nrk"
                                label="NRK"
                                value={form.nrk ?? ""}
                                onChange={(e) => onChange("nrk", e.target.value)}
                                error={fieldErrors.nrk}
                            />

                        </div>
                    )}

                </div>


                <Divider/>

            </div>
        </Modal>
    );
}