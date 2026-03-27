//Files: src/modules/student-family-info/application/usecase/UpdateStudentFamilyInfoUseCase.ts
//Files: src/modules/student-family-info/application/usecase/UpdateStudentFamilyInfoUseCase.ts

import { StudentFamilyInfo } from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { UpdateStudentFamilyInfoDTO } from "@/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO";

import {
	StudentFamilyInfoInterface
} from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";

import { AppError } from "@/modules/shared/errors/AppError";

import { BuildUpdateStudentFamilyInfo } from "@/modules/student-family-info/domain/builder/BuildUpdateStudentFamilyInfo";

export class UpdateStudentFamilyInfoUseCase
	extends BaseUseCase<UpdateStudentFamilyInfoDTO, StudentFamilyInfo> {

	constructor(
		private readonly repository: StudentFamilyInfoInterface
	) {
		super();
	}

	protected async handle(
		request: UpdateStudentFamilyInfoDTO
	): Promise<StudentFamilyInfo> {

		const existing =
			await this.repository.findByStudentId(request.studentId);

		if (!existing) {
			throw AppError.notFound(
				"Student family information not found"
			);
		}

		const entity =
			BuildUpdateStudentFamilyInfo(existing, request);

		return this.repository.update(entity);

	}

}