//Files: src/app/api/users/[id]/upload/route.ts
import { UploadController } from "@/modules/user/infrastructure/http/UploadController";
import { UserService } from "@/modules/user/application/services/UserServices";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";
import {LocalFileStorageService} from "@/modules/shared/http/interface/LocalFileStorageService";
import {UserRepository} from "@/modules/user/infrastructure/repo/UserRepository";

/**
 * =========================================================
 * Dependency Wiring (Manual DI)
 * =========================================================
 */

const repository = new UserRepository();
const hashService = new BcryptService();
const storage = new LocalFileStorageService();

const userService = new UserService(
    repository,
    hashService,
    storage
);

const controller = new UploadController(userService);

/**
 * =========================================================
 * POST /api/users/:id/upload
 * =========================================================
 *
 * Upload image untuk user berdasarkan ID.
 * ID berasal dari params, bukan dari login user.
 */
export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    return controller.upload(req, id);
}
