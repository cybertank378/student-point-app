// Files: src/modules/shared/http/RouteParamHelper.ts
import { NextRequest } from "next/server"

/**
 * ============================================================
 * ROUTE PARAM HELPER
 * ============================================================
 *
 * Utility helper untuk membaca parameter route dan query
 * parameter pada Next.js App Router secara konsisten.
 *
 * Tujuan:
 * - Menghindari duplikasi kode di route handler
 * - Menjaga konsistensi cara membaca params
 * - Memberikan type safety
 */

export class RouteParamHelper {

    /**
     * ============================================================
     * RESOLVE PARAMETER "id"
     * ============================================================
     *
     * Digunakan pada route seperti:
     *
     * /api/students/:id
     */

    static async id(
        params: Promise<{ id: string }>
    ): Promise<string> {

        const resolved = await params

        if (!resolved?.id) {
            throw new Error("Route parameter 'id' tidak ditemukan")
        }

        return resolved.id

    }

    /**
     * ============================================================
     * RESOLVE GENERIC PARAMETER
     * ============================================================
     *
     * Digunakan pada route seperti:
     *
     * /api/students/counseling/:caseId
     */

    static async param<
        T extends Record<string, string>,
        K extends keyof T
    >(
        params: Promise<T>,
        key: K
    ): Promise<string> {

        const resolved = await params

        const value = resolved?.[key]

        if (!value) {
            throw new Error(
                `Route parameter '${String(key)}' tidak ditemukan`
            )
        }

        return value

    }

    /**
     * ============================================================
     * RESOLVE QUERY PARAMETER
     * ============================================================
     *
     * Digunakan untuk membaca query seperti:
     *
     * ?page=1
     * ?limit=10
     */

    static query(
        req: NextRequest,
        key: string
    ): string {

        const value =
            req.nextUrl.searchParams.get(key)

        return value ?? ""

    }

    /**
     * ============================================================
     * RESOLVE QUERY NUMBER
     * ============================================================
     *
     * Digunakan untuk pagination seperti:
     *
     * ?page=1&limit=10
     */

    static queryNumber(
        req: NextRequest,
        key: string,
        defaultValue: number
    ): number {

        const value =
            req.nextUrl.searchParams.get(key)

        if (!value) {
            return defaultValue
        }

        const parsed = Number(value)

        return Number.isNaN(parsed)
            ? defaultValue
            : parsed

    }

}