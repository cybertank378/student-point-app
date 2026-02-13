//Files: src/modules/auth/server/getCurrentUser.ts

import {cookies} from "next/headers";
import {JwtService} from "../application/service/JwtService";
import {AuthPayload} from "../domain/entity/AuthPayload";

/**
 * =====================================================
 * GET CURRENT USER (SERVER ONLY)
 * =====================================================
 */
export async function getCurrentUser(): Promise<AuthPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return null;
    }

    const jwtService = new JwtService();

    try {
        return await jwtService.verifyRefreshToken(token);
    } catch {
        return null;
    }
}

