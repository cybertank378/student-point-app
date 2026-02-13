//Files: src/modules/auth/infrastructure/http/AuthController.ts

import { NextRequest, NextResponse} from "next/server";
import {
    loginSchema,
    changePasswordSchema,
    requestResetSchema,
    resetPasswordSchema,
} from "../validators/auth.validator";
import { handleZodError } from "@/modules/shared/errors/handleZodError";
import {DomainError} from "@/modules/shared/errors/DomainError";
import {AuthService} from "@/modules/auth/application/service/AuthService";
import {FIFTEEN_MINUTES, SEVEN_DAYS} from "@/libs/utils";

export class AuthController {
    constructor(
        private readonly service: AuthService,
    ) {}

    /**
     * Extract client IP safely from headers
     */
    private getClientIp(
        req: NextRequest,
    ): string | null {
        const forwarded =
            req.headers.get("x-forwarded-for");

        if (forwarded) {
            return forwarded.split(",")[0].trim();
        }

        const realIp =
            req.headers.get("x-real-ip");

        return realIp ?? null;
    }

    /**
     * ======================================
     * ============== LOGIN ================
     * ======================================
     * POST /api/auth/login
     */
    async login(req: NextRequest) {
        try {
            const body = loginSchema.parse(
                await req.json(),
            );

            const result = await this.service.login(
                body.username,
                body.password,
                this.getClientIp(req),
                req.headers.get("user-agent"),
            );

            const response = NextResponse.json({
                role: result.role,
                mustChangePassword:
                result.mustChangePassword,
            });

            // 🔥 ACCESS TOKEN COOKIE
            response.cookies.set("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: FIFTEEN_MINUTES, // 15 menit
            });

            // 🔥 REFRESH TOKEN COOKIE
            response.cookies.set("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SEVEN_DAYS, // 7 hari
            });

            return response;
        } catch (error) {
            if (error instanceof DomainError) {
                return NextResponse.json(
                    { message: error.message },
                    { status: error.statusCode },
                );
            }

            return handleZodError(error);
        }
    }

    /**
     * ======================================
     * ============== REFRESH ===============
     * ======================================
     * POST /api/auth/refresh
     */
    async refresh(req: NextRequest) {
        try {
            const cookie =
                req.cookies.get("refresh_token");

            if (!cookie?.value) {
                return Response.json(
                    { message: "Refresh token missing" },
                    { status: 401 },
                );
            }

            const result =
                await this.service.refresh(
                    cookie.value,
                );

            const response = Response.json({
                accessToken: result.accessToken,
            });

            response.headers.append(
                "Set-Cookie",
                `refresh_token=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
            );

            return response;
        } catch (error) {
            if (error instanceof DomainError) {
                return Response.json(
                    { message: error.message },
                    { status: error.statusCode },
                );
            }

            return Response.json(
                { message: "Invalid refresh token" },
                { status: 401 },
            );
        }
    }

    /**
     * ======================================
     * ============== LOGOUT ===============
     * ======================================
     * POST /api/auth/logout
     */
    async logout(req: NextRequest) {
        try {
            const refreshCookie = req.cookies.get("refresh_token");

            if (!refreshCookie?.value) {
                return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 401 }
                );
            }

            await this.service.logoutByRefreshToken(refreshCookie.value);

            const response = NextResponse.json({ success: true });

            // Clear refresh token
            response.cookies.set("refresh_token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0,
            });

            // Clear access token
            response.cookies.set("accessToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0,
            });

            return response;
        } catch (error) {
            return NextResponse.json(
                { message: "Logout failed" },
                { status: 400 }
            );
        }
    }
    /**
     * ======================================
     * ========== CHANGE PASSWORD ===========
     * ======================================
     * POST /api/auth/change-password
     */
    async changePassword(
        userId: string,
        req: NextRequest,
    ) {
        try {
            const body =
                changePasswordSchema.parse(
                    await req.json(),
                );

            await this.service.changePassword(
                userId,
                body.oldPassword,
                body.newPassword,
            );

            return Response.json({
                success: true,
            });
        } catch (error) {
            if (error instanceof DomainError) {
                return Response.json(
                    { message: error.message },
                    { status: error.statusCode },
                );
            }

            return handleZodError(error);
        }
    }

    /**
     * ======================================
     * ======== REQUEST RESET PASSWORD ======
     * ======================================
     * POST /api/auth/request-reset
     */
    async requestReset(req: NextRequest) {
        try {
            const body =
                requestResetSchema.parse(
                    await req.json(),
                );

            const token =
                await this.service.requestResetPassword(
                    body.username,
                );

            // Kirim token via email service (di luar controller)
            return Response.json({
                message: "Reset token generated",
                token, // production: jangan kirim ke client
            });
        } catch (error) {
            if (error instanceof DomainError) {
                return Response.json(
                    { message: error.message },
                    { status: error.statusCode },
                );
            }

            return handleZodError(error);
        }
    }

    /**
     * ======================================
     * =========== RESET PASSWORD ===========
     * ======================================
     * POST /api/auth/reset-password
     */
    async resetPassword(req: NextRequest) {
        try {
            const body =
                resetPasswordSchema.parse(
                    await req.json(),
                );

            await this.service.resetPassword(
                body.token,
                body.newPassword,
            );

            return Response.json({
                success: true,
            });
        } catch (error) {
            if (error instanceof DomainError) {
                return Response.json(
                    { message: error.message },
                    { status: error.statusCode },
                );
            }

            return handleZodError(error);
        }
    }
}
