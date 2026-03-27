//Files: src//modules/student-family-info/application/usecase/GetStudentFamilyInfoUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"

import { StudentFamilyInfoInterface } from "../../domain/interfaces/StudentFamilyInfoInterface"
import { StudentFamilyInfo } from "../../domain/entity/StudentFamilyInfo"

export class GetStudentFamilyInfoUseCase
	extends BaseUseCase<string, StudentFamilyInfo | null>
{

	constructor(
		private repository: StudentFamilyInfoInterface
	) {
		super()
	}

	protected async handle(
		studentId: string
	): Promise<StudentFamilyInfo | null> {

		return this.repository.findByStudentId(studentId)

	}

}