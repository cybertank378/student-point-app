//Files: src/modules/student-family-info/application/usecase/CreateStudentFamilyInfo.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import { StudentFamilyInfoInterface } from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";
import { CreateStudentFamilyInfoDTO } from "@/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO";
import { StudentFamilyInfo } from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";

import { BuildCreateStudentFamilyInfo } from "@/modules/student-family-info/domain/builder/BuildCreateStudentFamilyInfo";

export class CreateStudentFamilyInfoUseCase
	extends BaseUseCase<CreateStudentFamilyInfoDTO, StudentFamilyInfo> {

	constructor(
		private readonly repository: StudentFamilyInfoInterface
	) {
		super();
	}

	protected async handle(
		request: CreateStudentFamilyInfoDTO
	): Promise<StudentFamilyInfo> {

		const existing =
			await this.repository.findByStudentId(request.studentId);

		if (existing) {
			throw AppError.conflict(
				"Student family information already exists"
			);
		}

		const entity = BuildCreateStudentFamilyInfo(request);

		return this.repository.create(entity);

	}

}