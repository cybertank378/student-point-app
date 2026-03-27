//Files: src/modules/student-family-info/application/usecase/DeleteStudentFamilyInfoUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"
import {
	StudentFamilyInfoInterface
} from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";
import {DeleteStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/DeleteStudentFamilyInfoDTO";

export class DeleteStudentFamilyInfoUseCase
	extends BaseUseCase<DeleteStudentFamilyInfoDTO, void> {

	constructor(
		private readonly repository: StudentFamilyInfoInterface
	) {
		super();
	}

	protected async handle(
		payload: DeleteStudentFamilyInfoDTO
	): Promise<void> {

		await this.repository.delete(payload);

	}

}