//Files: src/app/api/users/_factory.ts
import {UserRepository} from "@/modules/user/infrastructure/repo/UserRepository";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";
import {UserService} from "@/modules/user/application/services/UserServices";
import {UserController} from "@/modules/user/infrastructure/http/UserController";
import {LocalFileStorageService} from "@/modules/shared/http/interface/LocalFileStorageService";

/**
 * =====================================================
 * DEPENDENCY INJECTION (COMPOSITION ROOT)
 * =====================================================
 */

// Infrastructure
const userRepository = new UserRepository();
const hashService = new BcryptService();
const storage = new LocalFileStorageService();

// Application Service
const userService = new UserService(
    userRepository,
    hashService,
    storage
);

// Controller
export const userController = new UserController(
    userService
);
