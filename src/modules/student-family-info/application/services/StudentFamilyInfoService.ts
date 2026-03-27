//Files: src/modules/student-family-info/application/services/StudentFamilyInfoService.tsts

import { BaseAppServices } from "@/modules/shared/core/BaseAppServices";
import {CreateStudentFamilyInfoUseCase} from "@/modules/student-family-info/application/usecase/CreateStudentFamilyInfo";
import {DeleteStudentFamilyInfoUseCase} from "@/modules/student-family-info/application/usecase/DeleteStudentFamilyInfoUseCase";
import {GetStudentFamilyInfoUseCase} from "@/modules/student-family-info/application/usecase/GetStudentFamilyInfoUseCase";
import {StudentFamilyInfoInterface} from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";
import {CreateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO";
import {UpdateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO";
import {DeleteStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/DeleteStudentFamilyInfoDTO";
import {UpdateStudentFamilyInfoUseCase} from "@/modules/student-family-info/application/usecase/UpdateStudentFamilyInfoUseCase";
import {
	UploadStudentDocumentUseCase
} from "@/modules/student-family-info/application/usecase/UploadStudentDocumentUseCase";
import {FileStorageInterface} from "@/libs/FileStorageInterface";
import {Result} from "@/modules/shared/core/Result";
import {UploadStudentDocumentRequest} from "@/modules/student-family-info/domain/dto/UploadStudentDocumentRequest";
import {
	DeleteStudentDocumentUseCase
} from "@/modules/student-family-info/application/usecase/DeleteStudentDocumentUseCase";


export class StudentFamilyInfoService extends BaseAppServices {

	private readonly createUC: CreateStudentFamilyInfoUseCase;
	private readonly updateUC: UpdateStudentFamilyInfoUseCase;
	private readonly deleteUC: DeleteStudentFamilyInfoUseCase;
	private readonly getUC: GetStudentFamilyInfoUseCase;
	private readonly uploadUC: UploadStudentDocumentUseCase;
	private readonly deleteUseCase : DeleteStudentDocumentUseCase;

	constructor(
		repo: StudentFamilyInfoInterface,
		storage: FileStorageInterface
	) {

		super();

		this.createUC =
			new CreateStudentFamilyInfoUseCase(repo);

		this.updateUC =
			new UpdateStudentFamilyInfoUseCase(repo);

		this.deleteUC =
			new DeleteStudentFamilyInfoUseCase(repo);

		this.getUC =
			new GetStudentFamilyInfoUseCase(repo);

		this.uploadUC =
			new UploadStudentDocumentUseCase(
				repo,
				storage
			);
		this.deleteUseCase = new DeleteStudentDocumentUseCase(repo, storage);

	}

	/**
	 * CREATE
	 */

	createStudentFamilyInfo(
		dto: CreateStudentFamilyInfoDTO
	) {

		return this.execute(
			this.createUC,
			dto
		);

	}

	/**
	 * UPDATE
	 */

	updateStudentFamilyInfo(
		dto: UpdateStudentFamilyInfoDTO
	) {

		return this.execute(
			this.updateUC,
			dto
		);

	}

	/**
	 * DELETE
	 */

	deleteStudentFamilyInfo(
		dto: DeleteStudentFamilyInfoDTO
	) {

		return this.execute(
			this.deleteUC,
			dto
		);

	}

	/**
	 * GET
	 */

	getStudentFamilyInfo(
		studentId: string
	) {

		return this.execute(
			this.getUC,
			studentId
		);

	}

	/**
	 * UPLOAD FAMILY CARD
	 */
	async uploadDocument(request: UploadStudentDocumentRequest) {
		return this.uploadUC.execute(request);
	}

	async deleteStudentDocument(studentId: string, filePath: string) {
		return this.deleteUseCase.execute({
			studentId,
			filePath
		});
	}

}