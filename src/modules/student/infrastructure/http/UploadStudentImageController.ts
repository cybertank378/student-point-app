//Files: src/modules/student/infrastructure/http/UploadStudentImageController.ts

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { StudentService } from "@/modules/student/application/services/StudentService";
import {UploadStudentImageRequest} from "@/modules/student/application/usecases/UploadStudentImageUseCase";

export class UploadStudentImageController {

	constructor(
		private readonly studentService: StudentService
	) {}

	async upload(req: Request, studentId: string) {

		/* 1️⃣ Parse multipart */
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		/* 2️⃣ HTTP validation */
		if (!file) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "File tidak ditemukan",
				}),
				{ status: 400 }
			);
		}

		/* 3️⃣ Delegate to application */
		const request: UploadStudentImageRequest = {
			studentId,
			file,
		};

		const result = await this.studentService.uploadStudentImage(request);

		/* 4️⃣ HTTP response */
		return HttpResultHandler.handle(result);
	}
}