//Files: src/modules/student-family-info/infrastructure/http/StudentFamilyInfoController.ts
import { NextRequest } from "next/server";

import { HttpResultHandler }
	from "@/modules/shared/http/HttpResultHandler";

import { StudentFamilyInfoService }
	from "@/modules/student-family-info/application/services/StudentFamilyInfoService";

import {
	CreateStudentFamilyInfoSchema,
	UpdateStudentFamilyInfoSchema,
	DeleteStudentFamilyInfoSchema,
	GetStudentFamilyInfoSchema
}
	from "@/modules/student-family-info/infrastructure/validators/student.family-info.validator";
import {UploadStudentDocumentRequest} from "@/modules/student-family-info/domain/dto/UploadStudentDocumentRequest";


/**
 * ============================================================
 * STUDENT FAMILY INFO CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student family
 * information requests.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Validate input using Zod
 * - Delegate execution to application service
 * - Return standardized HTTP response
 *
 * Controller must remain free of business logic.
 */

export class StudentFamilyInfoController {

	constructor(
		private readonly service: StudentFamilyInfoService

	) {}

	/**
	 * ============================================================
	 * GET STUDENT FAMILY INFO
	 * ============================================================
	 */

	async get(
		_req: NextRequest,
		studentId: string
	): Promise<Response> {

		const dto =
			GetStudentFamilyInfoSchema.parse({
				studentId
			});

		const result =
			await this.service.getStudentFamilyInfo(
				dto.studentId
			);

		return HttpResultHandler.handle(result);

	}


	/**
	 * ============================================================
	 * CREATE STUDENT FAMILY INFO
	 * ============================================================
	 */

	async create(
		req: NextRequest,
		studentId: string
	): Promise<Response> {

		const body =
			CreateStudentFamilyInfoSchema.parse(
				await req.json()
			);

		const dto = {
			studentId,
			...body
		};

		const result =
			await this.service.createStudentFamilyInfo(dto);

		return HttpResultHandler.handle(result);

	}


	/**
	 * ============================================================
	 * UPDATE STUDENT FAMILY INFO
	 * ============================================================
	 *
	 * Supports PATCH partial update.
	 */

	async update(
		req: NextRequest,
		studentId: string
	): Promise<Response> {

		const body =
			UpdateStudentFamilyInfoSchema.parse(
				await req.json()
			);

		const dto = {
			studentId,
			...body
		};

		const result =
			await this.service.updateStudentFamilyInfo(dto);

		return HttpResultHandler.handle(result);

	}


	/**
	 * ============================================================
	 * DELETE STUDENT FAMILY INFO
	 * ============================================================
	 */

	async delete(
		studentId: string
	): Promise<Response> {

		const dto =
			DeleteStudentFamilyInfoSchema.parse({
				studentId
			});

		const result =
			await this.service.deleteStudentFamilyInfo(dto);

		return HttpResultHandler.handle(result);

	}




}