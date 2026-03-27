//Files: src/modules/student/infrastructure/http/StudentImportTemplateBuilder.ts

import ExcelJS from "exceljs"
import {
	Gender,
	FamilyStatus
} from "@/libs/utils/enums"

/**
 * ============================================================
 * STUDENT IMPORT TEMPLATE BUILDER
 * ============================================================
 *
 * Generator Excel template untuk import data siswa.
 *
 * Fitur:
 *
 * • Header kolom sesuai DTO Student
 * • Data validation enum
 * • Sample row
 * • Instruction sheet
 * • Enum description notes
 *
 * Endpoint:
 *
 * GET /api/students/import-template
 */

export class StudentImportTemplateBuilder {

	static async build(): Promise<Buffer> {

		const workbook = new ExcelJS.Workbook()

		/* ============================================================
		 ENUM VALUES
		 ============================================================ */

		const genderValues: Gender[] = [
			"MALE",
			"FEMALE"
		]

		const familyStatusValues: FamilyStatus[] = [
			"COMPLETE",
			"SINGLE_MOTHER",
			"SINGLE_FATHER",
			"ORPHAN"
		]

		const familyStatusDescription: Record<FamilyStatus, string> = {

			COMPLETE: "Orang tua lengkap",

			SINGLE_MOTHER: "Hanya ibu",

			SINGLE_FATHER: "Hanya ayah",

			ORPHAN: "Yatim piatu"

		}

		/* ============================================================
		 MAIN SHEET
		 ============================================================ */

		const sheet = workbook.addWorksheet("Students")

		sheet.columns = [

			{ header: "NIS", key: "nis", width: 16 },
			{ header: "NISN", key: "nisn", width: 18 },

			{ header: "Nama", key: "name", width: 24 },
			{ header: "Nickname", key: "nickname", width: 20 },

			{ header: "Gender", key: "gender", width: 14 },

			{ header: "BirthPlace", key: "birthPlace", width: 20 },
			{ header: "BirthDate (YYYY-MM-DD)", key: "birthDate", width: 22 },

			{ header: "ReligionCode", key: "religionCode", width: 16 },

			{ header: "Address", key: "address", width: 28 },
			{ header: "Phone", key: "phone", width: 18 },
			{ header: "Email", key: "email", width: 24 },

			{ header: "NIK", key: "nik", width: 20 },
			{ header: "KKNumber", key: "kkNumber", width: 20 },

			{ header: "SchoolOrigin", key: "schoolOrigin", width: 24 },
			{ header: "GraduationScore", key: "graduationScore", width: 18 },

			{ header: "Instagram", key: "instagram", width: 20 },

			{ header: "FamilyStatus", key: "familyStatus", width: 20 },

			{ header: "IsDifable (true/false)", key: "isDifable", width: 18 },

			{ header: "DifableNotes", key: "difableNotes", width: 26 }

		]

		sheet.getRow(1).font = { bold: true }

		sheet.views = [{ state: "frozen", ySplit: 1 }]

		sheet.autoFilter = { from: "A1", to: "S1" }

		/* ============================================================
		 DATA VALIDATION
		 ============================================================ */

		for (let i = 2; i <= 200; i++) {

			// Gender dropdown
			sheet.getCell(`E${i}`).dataValidation = {
				type: "list",
				allowBlank: false,
				formulae: [`"${genderValues.join(",")}"`]
			}

			// Family Status dropdown
			sheet.getCell(`Q${i}`).dataValidation = {
				type: "list",
				allowBlank: true,
				formulae: [`"${familyStatusValues.join(",")}"`]
			}

			// Is Difable dropdown
			sheet.getCell(`R${i}`).dataValidation = {
				type: "list",
				allowBlank: false,
				formulae: [`"true,false"`]
			}

			// Family status description note
			sheet.getCell(`Q${i}`).note =
				familyStatusValues
					.map(v => `${v} = ${familyStatusDescription[v]}`)
					.join("\n")

		}

		/* ============================================================
		 SAMPLE ROW
		 ============================================================ */

		sheet.addRow({

			nis: "12345",
			nisn: "9988776655",

			name: "Ahmad Fauzan",
			nickname: "Fauzan",

			gender: "MALE",

			birthPlace: "Bandung",
			birthDate: "2008-01-15",

			religionCode: "ISLAM",

			address: "Jl. Merdeka No.10",
			phone: "081234567890",
			email: "fauzan@email.com",

			nik: "3275010101010001",
			kkNumber: "3275010101010002",

			schoolOrigin: "SMP Negeri 1 Bandung",
			graduationScore: 89.5,

			instagram: "@fauzan",

			familyStatus: "COMPLETE",

			isDifable: "false",

			difableNotes: ""

		})

		/* ============================================================
		 INSTRUCTION SHEET
		 ============================================================ */

		const instruction = workbook.addWorksheet("Instructions")

		instruction.columns = [

			{ header: "Field", key: "field", width: 30 },
			{ header: "Wajib?", key: "required", width: 12 },
			{ header: "Format / Aturan", key: "rule", width: 70 },
			{ header: "Contoh", key: "example", width: 30 }

		]

		instruction.getRow(1).font = { bold: true }

		const rows = [

			["NIS", "Opsional", "Nomor Induk Siswa", "12345"],

			["NISN", "Wajib", "Nomor Induk Siswa Nasional unik", "9988776655"],

			["Nama", "Wajib", "Nama lengkap siswa", "Ahmad Fauzan"],

			["Gender", "Wajib", `Enum: ${genderValues.join(", ")}`, "MALE"],

			["BirthPlace", "Wajib", "Tempat lahir siswa", "Bandung"],

			["BirthDate", "Wajib", "Format: YYYY-MM-DD", "2008-01-15"],

			["ReligionCode", "Wajib", "Kode agama sesuai sistem", "ISLAM"],

			["Phone", "Opsional", "Nomor telepon siswa", "081234567890"],

			["Email", "Opsional", "Email siswa", "email@mail.com"],

			[
				"FamilyStatus",
				"Opsional",
				`Enum: ${familyStatusValues.join(", ")}`,
				"COMPLETE"
			],

			["IsDifable", "Wajib", "Isi true atau false", "false"]

		]

		rows.forEach((r) => instruction.addRow(r))

		instruction.views = [{ state: "frozen", ySplit: 1 }]

		/* ============================================================
		 FINAL BUFFER
		 ============================================================ */

		const buffer = await workbook.xlsx.writeBuffer()

		return Buffer.from(buffer)

	}

}