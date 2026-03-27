//Files: src/modules/student-family-info/application/usecase/DeleteStudentDocumentUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { StudentFamilyInfoInterface } from "../../domain/interfaces/StudentFamilyInfoInterface";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";

export interface DeleteStudentDocumentRequest {
	studentId: string;
	filePath: string;
}

export class DeleteStudentDocumentUseCase extends BaseUseCase<
	DeleteStudentDocumentRequest,
	boolean
> {
	constructor(
		private repo: StudentFamilyInfoInterface,
		private storage: FileStorageInterface
	) {
		super();
	}

	protected async handle(
		request: DeleteStudentDocumentRequest
	): Promise<boolean> {

		const { studentId, filePath } = request;

		if (!filePath) {
			throw AppError.badRequest("File path required");
		}

		/**
		 * filePath example:
		 * /assets/upload/student/family-documents/2024000079_2025/file.pdf
		 */

		const cleanPath = filePath.replace("/assets/upload/", "");
		const parts = cleanPath.split("/");

		const fileName = parts.pop() as string;
		const folder = parts.join("/");

		// delete file fisik
		await this.storage.delete(folder, fileName);

		// delete database
		await this.repo.removeDocument(studentId, filePath);

		return true;
	}
}