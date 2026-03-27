//Files : src/modules/student-family-info/application/usecase/UploadStudentDocumentUseCase.ts
import path from "path";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { StudentFamilyInfoInterface } from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";
import type { FileStorageInterface, StoredFileResult } from "@/libs/FileStorageInterface";
import type { UploadStudentDocumentRequest } from "@/modules/student-family-info/domain/dto/UploadStudentDocumentRequest";

export class UploadStudentDocumentUseCase extends BaseUseCase<
	UploadStudentDocumentRequest,
	StoredFileResult
> {
	constructor(
		private repo: StudentFamilyInfoInterface,
		private storage: FileStorageInterface
	) {
		super();
	}

	protected async handle(
		request: UploadStudentDocumentRequest
	): Promise<StoredFileResult> {

		const { file, nisn, academicYear, studentId } = request;

		if (!file) {
			throw AppError.badRequest("File is required");
		}

		const ext = path.extname(file.name)
			.replace(".", "")
			.toLowerCase();

		const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];

		if (!allowedExtensions.includes(ext)) {
			throw AppError.badRequest("File type not allowed");
		}

		const fileName = `${Date.now()}.${ext}`;

		// ✔️ FIX PATH
		const folder = `student/family-documents/${nisn}_${academicYear}`;

		const stored = await this.storage.save(folder, fileName, file);
		await this.repo.addDocument(
			studentId,
			stored.publicUrl
		);

		return stored;
	}
}