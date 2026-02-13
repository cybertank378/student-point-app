//Files: src/modules/auth/application/service/JwtService.ts

import {
    generateAccessToken as coreGenerateAccessToken,
    generateRefreshToken as coreGenerateRefreshToken,
    verifyRefreshToken as coreVerifyRefreshToken,
} from "@/modules/shared/core/jwt";

import { TokenServiceInterface } from "@/modules/auth/domain/interfaces/TokenServiceInterface";
import { AuthPayload } from "@/modules/auth/domain/entity/AuthPayload";
import { Role, TeacherRole } from "@/generated/prisma";

export class JwtService implements TokenServiceInterface {
    async generateAccessToken(
        payload: AuthPayload
    ): Promise<string> {
        return coreGenerateAccessToken(payload);
    }

    async generateRefreshToken(
        payload: AuthPayload
    ): Promise<string> {
        return coreGenerateRefreshToken(payload);
    }

    async verifyRefreshToken(
        token: string
    ): Promise<AuthPayload> {
        const payload = await coreVerifyRefreshToken(token);

        return validateAuthPayload(payload);
    }
}

/**
 * =====================================================
 * PAYLOAD VALIDATION
 * =====================================================
 */

function isRole(value: unknown): value is Role {
    return (
        typeof value === "string" &&
        Object.values(Role).includes(value as Role)
    );
}

function isTeacherRole(value: unknown): value is TeacherRole {
    return (
        typeof value === "string" &&
        Object.values(TeacherRole).includes(
            value as TeacherRole
        )
    );
}

function validateAuthPayload(
    payload: unknown
): AuthPayload {
    if (
        typeof payload !== "object" ||
        payload === null
    ) {
        throw new Error("Invalid JWT payload");
    }

    const record = payload as Record<string, unknown>;

    if (
        typeof record.sub !== "string" ||
        !isRole(record.role)
    ) {
        throw new Error("Invalid token structure");
    }

    if (
        record.teacherRole !== undefined &&
        !isTeacherRole(record.teacherRole)
    ) {
        throw new Error("Invalid teacherRole");
    }

    return {
        sub: record.sub,
        role: record.role,
        teacherRole: record.teacherRole,
    };
}

