//Files: src/modules/auth/infrastructure/http/AuthController.ts
import { type NextRequest, NextResponse } from "next/server";
import {
    loginSchema,
    changePasswordSchema,
    requestResetSchema,
    resetPasswordSchema,
} from "../validators/auth.validator";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { AuthService } from "@/modules/auth/application/service/AuthService";

import { ONE_DAY, SEVEN_DAYS } from "@/libs/utils";

export class AuthController {
    constructor(private readonly service: AuthService) {}

    /* ============================================================
       HELPER
    ============================================================ */

    private getClientIp(req: NextRequest): string | null {
        const forwarded = req.headers.get("x-forwarded-for");
        if (forwarded) return forwarded.split(",")[0].trim();

        return req.headers.get("x-real-ip") ?? null;
    }

    /* ============================================================
       LOGIN
    ============================================================ */

    async login(req: NextRequest) {
        try {
            const body = loginSchema.parse(await req.json());

            const result = await this.service.login({
                username: body.username,
                password: body.password,
                ip: this.getClientIp(req),
                userAgent: req.headers.get("user-agent"),
            });

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            const response = NextResponse.json({
                role: value.role,
                mustChangePassword: value.mustChangePassword,
            });

            response.cookies.set("accessToken", value.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: ONE_DAY,
            });

            response.cookies.set("refresh_token", value.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SEVEN_DAYS,
            });

            return response;
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ============================================================
       REFRESH
    ============================================================ */

    async refresh(req: NextRequest) {
        try {
            const cookie = req.cookies.get("refresh_token");

            if (!cookie?.value) {
                return NextResponse.json(
                    { message: "Refresh token missing" },
                    { status: 401 }
                );
            }

            const result = await this.service.refresh({
                refreshToken: cookie.value,
            });

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            const response = NextResponse.json({
                accessToken: value.accessToken,
            });

            response.cookies.set("refresh_token", value.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SEVEN_DAYS,
            });

            return response;
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ============================================================
       LOGOUT
    ============================================================ */

    async logout(req: NextRequest) {
        const cookie = req.cookies.get("refresh_token");

        if (!cookie?.value) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = await this.service.logout({
            refreshToken: cookie.value,
        });

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        const response = NextResponse.json({ success: true });

        response.cookies.set("refresh_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        response.cookies.set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    }

    /* ============================================================
       CHANGE PASSWORD
    ============================================================ */

    async changePassword(userId: string, req: NextRequest) {
        try {
            const body = changePasswordSchema.parse(await req.json());

            const result = await this.service.changePassword({
                userId,
                oldPassword: body.oldPassword,
                newPassword: body.newPassword,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ============================================================
       REQUEST RESET PASSWORD
    ============================================================ */

    async requestReset(req: NextRequest) {
        try {
            const body = requestResetSchema.parse(await req.json());

            const result = await this.service.requestResetPassword({
                username: body.username,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ============================================================
       RESET PASSWORD
    ============================================================ */

    async resetPassword(req: NextRequest) {
        try {
            const body = resetPasswordSchema.parse(await req.json());

            const result = await this.service.resetPassword({
                token: body.token,
                newPassword: body.newPassword,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }
}