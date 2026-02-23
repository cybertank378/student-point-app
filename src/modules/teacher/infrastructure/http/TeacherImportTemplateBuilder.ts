//Files: src/modules/teacher/infrastructure/http/TeacherImportTemplateBuilder.ts
import ExcelJS from "exceljs";
import type {
    Gender,
    EducationLevel,
    TeacherRole,
} from "@/generated/prisma";

/**
 * ============================================================
 * TEACHER IMPORT TEMPLATE BUILDER
 * ============================================================
 *
 * Generates enterprise-grade Excel template with:
 * - Header
 * - Data validation
 * - Sample row
 * - Instructions sheet
 * - Role description in Bahasa Indonesia
 */
export class TeacherImportTemplateBuilder {

    static async build(): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();

        /* ============================================================
           ENUM VALUES
        ============================================================ */

        const genderValues: Gender[] = ["MALE", "FEMALE"];

        // 🔥 Perbaikan: hapus duplikat DII
        const educationValues: EducationLevel[] = [
            "SMA",
            "DI",
            "DII",
            "DIII",
            "DIV",
            "S1",
            "S2",
            "S3",
        ];

        const roleValues: TeacherRole[] = [
            "SUBJECT_TEACHER",
            "HOMEROOM",
            "COUNSELOR",
            "DUTY_TEACHER",
        ];

        /**
         * ============================================================
         * ROLE DESCRIPTION (Bahasa Indonesia)
         * ============================================================
         */

        const roleDescription: Record<TeacherRole, string> = {
            SUBJECT_TEACHER: "Guru Mata Pelajaran",
            HOMEROOM: "Wali Kelas",
            COUNSELOR: "Guru Bimbingan Konseling (BK)",
            DUTY_TEACHER: "Guru Piket",
        };

        /* ============================================================
           MAIN SHEET
        ============================================================ */

        const sheet = workbook.addWorksheet("Teachers");

        sheet.columns = [
            { header: "NIP", key: "nip", width: 18 },
            { header: "NUPTK", key: "nuptk", width: 18 },
            { header: "NRK", key: "nrk", width: 18 },
            { header: "NRG", key: "nrg", width: 18 },
            { header: "Nama", key: "name", width: 24 },
            { header: "Gender", key: "gender", width: 14 },
            { header: "ReligionCode", key: "religionCode", width: 16 },
            { header: "Telepon", key: "phone", width: 18 },
            { header: "Email", key: "email", width: 26 },
            { header: "EducationLevel", key: "educationLevel", width: 18 },
            { header: "Major", key: "major", width: 20 },
            { header: "GraduationYear", key: "graduationYear", width: 18 },
            { header: "BirthPlace", key: "birthPlace", width: 20 },
            { header: "BirthDate (YYYY-MM-DD)", key: "birthDate", width: 22 },
            { header: "Roles (pisahkan dengan koma)", key: "roles", width: 30 },
            { header: "IsPns (true/false)", key: "isPns", width: 18 },
        ];

        sheet.getRow(1).font = { bold: true };
        sheet.views = [{ state: "frozen", ySplit: 1 }];
        sheet.autoFilter = { from: "A1", to: "P1" };

        /* ============================================================
           DATA VALIDATION
        ============================================================ */

        for (let i = 2; i <= 200; i++) {

            sheet.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: [`"${genderValues.join(",")}"`],
            };

            sheet.getCell(`J${i}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: [`"${educationValues.join(",")}"`],
            };

            sheet.getCell(`P${i}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: [`"true,false"`],
            };

            sheet.getCell(`O${i}`).note =
                `Gunakan salah satu atau kombinasi berikut:\n\n` +
                roleValues
                    .map(r => `${r} = ${roleDescription[r]}`)
                    .join("\n") +
                `\n\nPisahkan dengan koma tanpa spasi.\nContoh: SUBJECT_TEACHER,HOMEROOM`;
        }

        /* ============================================================
           SAMPLE ROW
        ============================================================ */

        sheet.addRow({
            nip: "19890101",
            nuptk: "123456789",
            nrk: "99887766",
            nrg: "151010000001",
            name: "Ahmad Wijaya",
            gender: "MALE",
            religionCode: "ISLAM",
            phone: "08123456789",
            email: "ahmad@mail.com",
            educationLevel: "S1",
            major: "Matematika",
            graduationYear: 2012,
            birthPlace: "Bandung",
            birthDate: "1989-01-01",
            roles: "SUBJECT_TEACHER,HOMEROOM",
            isPns: "true",
        });

        /* ============================================================
           INSTRUCTION SHEET
        ============================================================ */

        const instruction = workbook.addWorksheet("Instructions");

        instruction.columns = [
            { header: "Field", key: "field", width: 30 },
            { header: "Wajib?", key: "required", width: 12 },
            { header: "Format / Aturan", key: "rule", width: 70 },
            { header: "Contoh", key: "example", width: 30 },
        ];

        instruction.getRow(1).font = { bold: true };

        const rows = [
            ["NIP", "Opsional", "String unik jika ada", "19890101"],
            ["NRG", "Wajib", "String unik wajib diisi", "151010000001"],
            ["Nama", "Wajib", "Teks nama lengkap guru", "Ahmad Wijaya"],
            ["Gender", "Wajib", `Enum: ${genderValues.join(", ")}`, "MALE"],
            ["ReligionCode", "Wajib", "Kode agama sesuai sistem", "ISLAM"],
            ["EducationLevel", "Wajib", `Enum: ${educationValues.join(", ")}`, "S1"],
            ["GraduationYear", "Wajib", "Tahun lulus format YYYY", "2012"],
            ["BirthDate", "Wajib", "Format: YYYY-MM-DD", "1989-01-01"],
            [
                "Roles",
                "Wajib",
                roleValues
                    .map(r => `${r} = ${roleDescription[r]}`)
                    .join(" | "),
                "SUBJECT_TEACHER,HOMEROOM"
            ],
            ["IsPns", "Wajib", "Isi true atau false", "true"],
        ];

        rows.forEach((r) => instruction.addRow(r));

        instruction.views = [{ state: "frozen", ySplit: 1 }];

        /* ============================================================
           FINAL BUFFER
        ============================================================ */

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}