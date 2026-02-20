//Files: src/modules/auth/application/service/AuthService.ts
import { LoginUseCase, type LoginRequest, type LoginResponse }
    from "@/modules/auth/application/usecase/LoginUseCase";

import { RefreshTokenUseCase, type RefreshTokenRequest, type RefreshTokenResponse }
    from "@/modules/auth/application/usecase/RefreshTokenUseCase";

import { LogoutUseCase, type LogoutRequest }
    from "@/modules/auth/application/usecase/LogoutUseCase";

import { ChangePasswordUseCase, type ChangePasswordRequest }
    from "@/modules/auth/application/usecase/ChangePasswordUseCase";

import { RequestResetPasswordUseCase, type RequestResetPasswordRequest, type RequestResetPasswordResponse }
    from "@/modules/auth/application/usecase/RequestResetPasswordUseCase";

import { ResetPasswordUseCase, type ResetPasswordRequest }
    from "@/modules/auth/application/usecase/ResetPasswordUseCase";

import type { AuthRepositoryInterface }
    from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";

import type { HashServiceInterface }
    from "@/modules/auth/domain/interfaces/HashServiceInterface";

import type { TokenServiceInterface }
    from "@/modules/auth/domain/interfaces/TokenServiceInterface";

/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Compose Auth use cases
 * - Act as application facade for controller
 * - No business logic here
 *
 * Architecture:
 * - Delegates to BaseUseCase-based use cases
 * - Returns Promise<Result<T>>
 * - No try/catch
 * - No manual Result handling
 */

export class AuthService {
    private readonly loginUC: LoginUseCase;
    private readonly refreshUC: RefreshTokenUseCase;
    private readonly logoutUC: LogoutUseCase;
    private readonly changePasswordUC: ChangePasswordUseCase;
    private readonly requestResetUC: RequestResetPasswordUseCase;
    private readonly resetPasswordUC: ResetPasswordUseCase;

    constructor(
        repo: AuthRepositoryInterface,
        hash: HashServiceInterface,
        token: TokenServiceInterface
    ) {
        this.loginUC = new LoginUseCase(repo, hash, token);
        this.refreshUC = new RefreshTokenUseCase(repo, hash, token);
        this.logoutUC = new LogoutUseCase(repo);
        this.changePasswordUC = new ChangePasswordUseCase(repo, hash);
        this.requestResetUC = new RequestResetPasswordUseCase(repo, hash);
        this.resetPasswordUC = new ResetPasswordUseCase(repo, hash);
    }

    /* ============================================================
       LOGIN
    ============================================================ */

    login(request: LoginRequest) {
        return this.loginUC.execute(request);
    }

    /* ============================================================
       REFRESH TOKEN
    ============================================================ */

    refresh(request: RefreshTokenRequest) {
        return this.refreshUC.execute(request);
    }

    /* ============================================================
       LOGOUT (by token or all sessions)
    ============================================================ */

    logout(request: LogoutRequest) {
        return this.logoutUC.execute(request);
    }

    /* ============================================================
       CHANGE PASSWORD
    ============================================================ */

    changePassword(request: ChangePasswordRequest) {
        return this.changePasswordUC.execute(request);
    }

    /* ============================================================
       REQUEST RESET PASSWORD
    ============================================================ */

    requestResetPassword(
        request: RequestResetPasswordRequest
    ) {
        return this.requestResetUC.execute(request);
    }

    /* ============================================================
       RESET PASSWORD
    ============================================================ */

    resetPassword(request: ResetPasswordRequest) {
        return this.resetPasswordUC.execute(request);
    }
}