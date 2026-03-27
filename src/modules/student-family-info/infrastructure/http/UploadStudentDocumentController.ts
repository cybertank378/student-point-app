// Files : src/modules/student-family-info/infrastructure/http/UploadStudentDocumentController.ts
import { parseUploadRequest } from "@/modules/shared/http/UploadRequestParser";
import type { StudentFamilyInfoService } from "@/modules/student-family-info/application/services/StudentFamilyInfoService";
import { UploadStudentDocumentRequest } from "@/modules/student-family-info/domain/dto/UploadStudentDocumentRequest";

export class UploadStudentDocumentController {
	constructor(
		private readonly service: StudentFamilyInfoService
	) {}

	async upload(req: Request, studentId: string): Promise<Response> {
		try {
			const { file, fields } =
				await parseUploadRequest(req);

			const nisn = fields.nisn;
			const academicYear = fields.academicYear;

			if (!file || !nisn || !academicYear) {
				return Response.json({
					data: null,
					error: { message: "Data upload tidak lengkap" }
				}, { status: 400 });
			}

			const request: UploadStudentDocumentRequest = {
				studentId,
				file,
				nisn,
				academicYear
			};

			const result =
				await this.service.uploadDocument(request);

			if (!result.getValue()) {
				return Response.json({
					data: null,
					error: result.error
				}, { status: 400 });
			}

			return Response.json({
				data: {
					fileUrl: result.getValue().publicUrl
				},
				error: null
			});

		} catch (err) {
			return Response.json({
				data: null,
				error: {
					message:
						err instanceof Error
							? err.message
							: "Upload gagal"
				}
			}, { status: 400 });
		}
	}
}