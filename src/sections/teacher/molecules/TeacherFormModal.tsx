"use client";

import Image from "next/image";
import {FiX} from "react-icons/fi";
import {Modal} from "@/shared-ui/component/Modal";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import Divider from "@/shared-ui/component/Divider";
import {getCivilServantRankLabel, teacherRoleLabel} from "@/libs/utils";
import {useReligionApi} from "@/modules/religion/presentation/hooks/useReligionApi";
import {CivilServantRank, EducationLevel, Gender, TeacherRole,} from "@/generated/prisma";
import CheckboxGroup from "@/shared-ui/component/CheckboxGroup";
import {UploadButton} from "@/shared-ui/component/UploadButton";


// TeacherFormModal.tsx

export interface TeacherFormType {
    nip?: string | null;
    nuptk?: string | null;
    nrk?: string | null;
    nrg?: string | null;

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

    civilServantRank?: CivilServantRank | null;

    roles: TeacherRole[];
    isPns?: boolean;
}


interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    subtitle?: string;
    mode: "add" | "edit";
    form: TeacherFormType;
    onChange: <K extends keyof TeacherFormType>(
        field: K,
        value: TeacherFormType[K]
    ) => void;
    loading?: boolean;
    errors?: Record<string, string[]>;
}

export default function TeacherFormModal({
                                             open,
                                             onClose,
                                             onSubmit,
                                             title,
                                             subtitle,
                                             mode,
                                             form,
                                             onChange,
                                             loading = false,
                                             errors = {},
                                         }: Props) {
    const {religions} = useReligionApi();

    const getError = (field: keyof TeacherFormType) =>
        errors?.[field]?.[0];

    const handleRoleChange = (role: TeacherRole) => {
        const exists = form.roles.includes(role);

        if (exists) {
            onChange(
                "roles",
                form.roles.filter((r) => r !== role)
            );
        } else {
            onChange("roles", [...form.roles, role]);
        }
    };

    const handleUpload = async (
        file: File,
        onProgress: (percent: number) => void,
    ) => {
        // Simulasi upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((r) => setTimeout(r, 40));
            onProgress(i);
        }

        // Preview sementara
        const previewUrl = URL.createObjectURL(file);

        onChange("photo", previewUrl);
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            onSubmit={onSubmit}
            title={mode === "add" ? "Tambah Guru" : "Edit Guru"}
            subtitle="Lengkapi informasi guru dengan benar"
            submitDisabled={loading}
            size="xl"
            className="min-w-[250px]"
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
                                                src={form.photo}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded-full border-4 border-blue-500 bg-white shadow-sm"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => onChange("photo", null)}
                                                className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full shadow"
                                            >
                                                <FiX/>
                                            </button>
                                        </>
                                    ) : (
                                        <div
                                            className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm border">
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
                            label="Nama Lengkap"
                            value={form.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            required
                        />

                        <SelectField
                            label="Jenis Kelamin"
                            value={form.gender}
                            onChange={(e) =>
                                onChange("gender", e.target.value as Gender)
                            }
                        >
                            <option value={Gender.MALE}>Laki-laki</option>
                            <option value={Gender.FEMALE}>Perempuan</option>
                        </SelectField>

                        <SelectField
                            label="Agama"
                            value={form.religionCode}
                            onChange={(e) =>
                                onChange("religionCode", e.target.value)
                            }
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
                            label="Email"
                            value={form.email ?? ""}
                            onChange={(e) =>
                                onChange("email", e.target.value)
                            }
                        />

                        <TextField
                            label="No. Telepon"
                            value={form.phone ?? ""}
                            onChange={(e) =>
                                onChange("phone", e.target.value)
                            }
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
                                label="Tempat Lahir"
                                value={form.birthPlace}
                                onChange={(e) =>
                                    onChange("birthPlace", e.target.value)
                                }
                            />

                            <TextField
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
                            />
                        </div>
                    </div>


                    {/* ================= PENDIDIKAN (RIGHT) ================= */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Pendidikan
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <SelectField
                                label="Pendidikan Terakhir"
                                value={form.educationLevel}
                                onChange={(e) =>
                                    onChange(
                                        "educationLevel",
                                        e.target.value as EducationLevel
                                    )
                                }
                            >
                                {Object.values(EducationLevel).map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </SelectField>

                            <TextField
                                label="Jurusan"
                                value={form.major ?? ""}
                                onChange={(e) =>
                                    onChange("major", e.target.value)
                                }
                            />

                            <TextField
                                label="Tahun Lulus"
                                type="number"
                                value={form.graduationYear}
                                onChange={(e) =>
                                    onChange(
                                        "graduationYear",
                                        Number(e.target.value)
                                    )
                                }
                            />
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
                                {/* SWITCH DI BAWAH LABEL */}
                                <button
                                    type="button"
                                    onClick={() => onChange("isPns", !form.isPns)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                                        form.isPns ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                                >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-all duration-300 ${
                                        form.isPns ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                                </button>

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
                            label="NRG"
                            value={form.nrg ?? ""}
                            type="number"
                            onChange={(e) => onChange("nrg", e.target.value)}
                            maxLengthValue={12}
                            minLengthValue={3}
                            showCounter
                            required
                        />
                    </div>

                    {/* FIELD KHUSUS PNS */}
                    {form.isPns && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">

                            <SelectField
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
                            >
                                <option value="">Pilih Golongan</option>

                                {Object.values(CivilServantRank).map((rank) => (
                                    <option key={rank} value={rank}>
                                        {getCivilServantRankLabel(rank)}
                                    </option>
                                ))}
                            </SelectField>

                            <TextField
                                label="NIP"
                                value={form.nip ?? ""}
                                onChange={(e) => onChange("nip", e.target.value)}
                            />

                            <TextField
                                label="NUPTK"
                                value={form.nuptk ?? ""}
                                onChange={(e) => onChange("nuptk", e.target.value)}
                            />

                            <TextField
                                label="NRK"
                                value={form.nrk ?? ""}
                                onChange={(e) => onChange("nrk", e.target.value)}
                            />

                        </div>
                    )}

                </div>


                <Divider/>

            </div>
        </Modal>
    );
}
