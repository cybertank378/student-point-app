//Files: src/modules/auth/server/getCurrentUser.ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/shared/core/jwt";
import { serverLog } from "@/libs/serverLogger";
import { UserRole, TeacherRole } from "@/libs/utils";

interface JwtPayload {
    sub: string;
    role: UserRole;
    teacherRole?: TeacherRole;
    username?: string;
}

function isJwtPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    const record = payload as Record<string, unknown>;

    return (
        typeof record.sub === "string" &&
        typeof record.role === "string"
    );
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        serverLog("getCurrentUser → No accessToken cookie");
        return null;
    }

    try {
        serverLog("getCurrentUser → Verifying access token");

        const decoded = await verifyAccessToken(token);

        serverLog("getCurrentUser → Decoded payload", decoded);

        if (!isJwtPayload(decoded)) {
            serverLog("getCurrentUser → Invalid payload shape");
            return null;
        }

        const user: JwtPayload = {
            sub: decoded.sub,
            role: decoded.role as UserRole,
            teacherRole: decoded.teacherRole as TeacherRole | undefined,
            username: decoded.username as string | undefined,
        };

        serverLog("getCurrentUser → Success", {
            sub: user.sub,
            role: user.role,
            teacherRole: user.teacherRole,
            username: user.username,
        });

        return user;
    } catch (error) {
        serverLog("getCurrentUser → Token verification failed", error);
        return null;
    }
}
