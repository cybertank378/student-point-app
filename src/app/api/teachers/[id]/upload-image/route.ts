// Files: src/app/api/teachers/[id]/upload/route.ts

import { UploadTeacherImageController } from "@/modules/teacher/infrastructure/http/UploadTeacherImageController";
import { TeacherService } from "@/modules/teacher/application/services/TeacherService";
import { LocalFileStorageService } from "@/modules/shared/http/interface/LocalFileStorageService";
import { TeacherRepository } from "@/modules/teacher/infrastructure/repo/TeacherRepository";

/**
 * =========================================================
 * Dependency Wiring (Manual DI)
 * =========================================================
 */

const repository = new TeacherRepository();
const storage = new LocalFileStorageService();

const teacherService = new TeacherService(
    repository,
    storage
);

const controller = new UploadTeacherImageController(
    teacherService
);

/**
 * =========================================================
 * POST /api/teachers/:id/upload
 * =========================================================
 */

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    return controller.upload(req, id);
}