import { z } from "zod";
import {
    EducationLevel,
    Gender,
    TeacherRole,
    CivilServantRank,
} from "@/generated/prisma";

const currentYear = new Date().getFullYear();

export const TeacherFormSchema = z
    .object({
        name: z
            .string()
            .min(1, "Nama wajib diisi.")
            .min(3, "Nama minimal 3 karakter."),

        gender: z.nativeEnum(Gender, {
            message: "Jenis kelamin wajib dipilih.",
        }),

        religionCode: z
            .string()
            .min(1, "Agama wajib dipilih."),

        email: z
            .string()
            .email("Format email tidak valid.")
            .optional()
            .or(z.literal("")),

        phone: z
            .string()
            .regex(/^[0-9]{10,15}$/, "No. telepon harus 10–15 digit angka.")
            .optional()
            .or(z.literal("")),

        roles: z
            .array(z.nativeEnum(TeacherRole))
            .min(1, "Minimal satu peran guru harus dipilih."),

        birthPlace: z
            .string()
            .min(1, "Tempat lahir wajib diisi.")
            .min(3, "Tempat lahir minimal 3 karakter."),

        birthDate: z
            .date()
            .max(new Date(), "Tanggal lahir tidak boleh di masa depan."),

        educationLevel: z.nativeEnum(EducationLevel, {
            message: "Pendidikan terakhir wajib dipilih.",
        }),

        major: z
            .string()
            .min(1, "Jurusan wajib diisi.")
            .min(3, "Jurusan minimal 3 karakter."),

        graduationYear: z
            .number()
            .min(1950, "Tahun lulus tidak valid.")
            .max(currentYear, "Tahun lulus tidak boleh di masa depan."),

        isPns: z.boolean(),

        nrg: z
            .string()
            .min(1, "NRG wajib diisi.")
            .min(3, "NRG minimal 3 digit.")
            .max(12, "NRG maksimal 12 digit.")
            .regex(/^[0-9]+$/, "NRG hanya boleh angka."),

        nip: z.string().nullable().optional(),
        nuptk: z.string().nullable().optional(),
        nrk: z.string().nullable().optional(),
        civilServantRank: z.nativeEnum(CivilServantRank).nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isPns) {
            if (!data.nip) {
                ctx.addIssue({
                    path: ["nip"],
                    code: "custom",
                    message: "NIP wajib diisi untuk PNS.",
                });
            } else if (!/^\d{18}$/.test(data.nip)) {
                ctx.addIssue({
                    path: ["nip"],
                    code: "custom",
                    message: "NIP harus 18 digit angka.",
                });
            }

            if (!data.nrk) {
                ctx.addIssue({
                    path: ["nrk"],
                    code: "custom",
                    message: "NRK wajib diisi untuk PNS.",
                });
            }

            if (!data.civilServantRank) {
                ctx.addIssue({
                    path: ["civilServantRank"],
                    code: "custom",
                    message: "Golongan PNS wajib dipilih.",
                });
            }
        }
    });