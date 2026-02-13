//Files: src/modules/shared/http/getRouteParam.ts

import type { NextRequest } from "next/server";

/**
 * Ambil parameter terakhir dari URL path
 * Contoh:
 *  /api/students/123   -> "123"
 *  /api/violations/1  -> "1"
 */
export function getRouteParam(
    req: NextRequest,
): string {
    const segments = req.nextUrl.pathname
        .split("/")
        .filter(Boolean);

    return segments[segments.length - 1];
}


export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;