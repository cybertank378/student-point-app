//Files: src/app/api/users/_factory.ts

import { UserRepository } from "@/modules/user/infrastructure/repo/UserRepository";
import { UserController } from "@/modules/user/infrastructure/http/UserController";
import {UserService} from "@/modules/user/application/services/UserServices";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";


export function createUserController(): UserController {
    const repo = new UserRepository();
    const hash = new BcryptService();
    const service = new UserService(repo, hash);
    return new UserController(service);
}
