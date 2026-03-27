//Files: src/modules/student-family-info/infrastructure/http/DeleteStudentDocumentController.ts

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import {StudentFamilyInfoService} from "@/modules/student-family-info/application/services/StudentFamilyInfoService";

export class DeleteStudentDocumentController {
	constructor(
		private readonly service: StudentFamilyInfoService
	) {}

	async delete(req: Request, studentId: string) {
		const body = await req.json();

		const result = await this.service.deleteStudentDocument(
			studentId,
			body.filePath
		);

		return HttpResultHandler.handle(result);
	}
}