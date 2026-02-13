//Files: src/app/api/auth/login/authFactory.ts

import {AuthController} from "@/modules/auth/infrastructure/http/AuthController";
import {AuthRepository} from "@/modules/auth/infrastructure/repo/AuthRepository";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";
import {JwtService} from "@/modules/auth/application/service/JwtService";
import {AuthService} from "@/modules/auth/application/service/AuthService";

export function buildAuthController(): AuthController {
    /**
     * Infrastructure dependencies
     */
    const repository = new AuthRepository();
    const hashService = new BcryptService();
    const tokenService = new JwtService();

    /**
     * Application service
     */
    const authService = new AuthService(
        repository,
        hashService,
        tokenService,
    );

    /**
     * HTTP Controller
     */
    return new AuthController(authService);
}