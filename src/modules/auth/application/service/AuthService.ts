//Files: src/modules/auth/application/service/AuthService.ts

import {LoginUseCase} from "@/modules/auth/application/usecase/LoginUseCase";
import {RefreshTokenUseCase} from "@/modules/auth/application/usecase/RefreshTokenUseCase";
import {LogoutUseCase} from "@/modules/auth/application/usecase/LogoutUseCase";
import {ChangePasswordUseCase} from "@/modules/auth/application/usecase/ChangePasswordUseCase";
import {RequestResetPasswordUseCase} from "@/modules/auth/application/usecase/RequestResetPasswordUseCase";
import {AuthRepositoryInterface} from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";
import {TokenServiceInterface} from "@/modules/auth/domain/interfaces/TokenServiceInterface";
import {ResetPasswordUseCase} from "@/modules/auth/application/usecase/ResetPasswordUseCase";

export class AuthService {
    private loginUC: LoginUseCase;
    private refreshUC: RefreshTokenUseCase;
    private logoutUC: LogoutUseCase;
    private changePasswordUC: ChangePasswordUseCase;
    private requestResetUC: RequestResetPasswordUseCase;
    private resetPasswordUC: ResetPasswordUseCase;

    constructor(
        repo: AuthRepositoryInterface,
        hash: HashServiceInterface,
        token: TokenServiceInterface,
    ) {
        this.loginUC = new LoginUseCase(repo, hash, token);
        this.refreshUC = new RefreshTokenUseCase(repo, hash, token);
        this.logoutUC = new LogoutUseCase(repo);
        this.changePasswordUC = new ChangePasswordUseCase(repo, hash);
        this.requestResetUC = new RequestResetPasswordUseCase(repo, hash);
        this.resetPasswordUC = new ResetPasswordUseCase(repo, hash);
    }

    login(
        ...args: Parameters<LoginUseCase["execute"]>
    ) {
        return this.loginUC.execute(...args);
    }

    refresh(
        ...args: Parameters<RefreshTokenUseCase["execute"]>
    ) {
        return this.refreshUC.execute(...args);
    }

    logout(
        ...args: Parameters<LogoutUseCase["execute"]>
    ) {
        return this.logoutUC.execute(...args);
    }

    logoutByRefreshToken(refreshToken: string) {
        return this.logoutUC.executeByRefreshToken(refreshToken);
    }

    changePassword(
        ...args: Parameters<ChangePasswordUseCase["execute"]>
    ) {
        return this.changePasswordUC.execute(...args);
    }

    requestResetPassword(
        ...args: Parameters<RequestResetPasswordUseCase["execute"]>
    ) {
        return this.requestResetUC.execute(...args);
    }

    resetPassword(
        ...args: Parameters<ResetPasswordUseCase["execute"]>
    ) {
        return this.resetPasswordUC.execute(...args);
    }
}