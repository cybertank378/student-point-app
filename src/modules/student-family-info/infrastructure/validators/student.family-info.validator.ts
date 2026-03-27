//Files: src/modules/student-point/infrastructure/validators/student.family-info.validator.ts

import { z } from "zod";

import { HouseOwnership } from "@/libs/utils/enums";

import {
	BaseIdSchema,
	BaseNisnSchema
} from "@/modules/student/infrastructure/validators/base.student.validator";

/**
 * ============================================================
 * CREATE STUDENT FAMILY INFO
 * ============================================================
 */

export const CreateStudentFamilyInfoSchema = z.object({

	livingWith: z.string(),

	houseOwnership: z
		.nativeEnum(HouseOwnership)
		.nullable(),

	headOfFamilyName: z.string(),

	familyCardAddress: z.string(),

	documents: z
		.array(z.string())
		.nullable()
});

/**
 * ============================================================
 * UPDATE STUDENT FAMILY INFO
 * ============================================================
 */

export const UpdateStudentFamilyInfoSchema =
	CreateStudentFamilyInfoSchema.partial();

/**
 * ============================================================
 * DELETE STUDENT FAMILY INFO
 * ============================================================
 */

export const DeleteStudentFamilyInfoSchema = z.object({
	studentId: BaseIdSchema
});

/**
 * ============================================================
 * GET STUDENT FAMILY INFO
 * ============================================================
 */

export const GetStudentFamilyInfoSchema = z.object({
	studentId: BaseIdSchema
});

/**
 * ============================================================
 * UPLOAD FAMILY DOCUMENT
 * ============================================================
 */

export const UploadDocumentSchema = z.object({

	studentId: BaseIdSchema,

	nisn: BaseNisnSchema,

	academicYear: z.string(),

	file: z.instanceof(File)

});