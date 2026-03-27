//Files: src/modules/student-report/domain/dto/index.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Report DTO Barrel
 *
 * @module student-report
 * @layer domain
 * @since 2026
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Barrel file untuk mengekspor seluruh DTO yang digunakan
 * oleh module student-report.
 *
 * Tujuan penggunaan barrel:
 *
 * - mempermudah import
 * - menjaga DRY import path
 * - meningkatkan maintainability
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * tidak ada
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * seluruh DTO student-report
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * import type { StudentStatisticDTO } from "@/modules/student-report/domain/dto"
 *
 */

export type { AttendanceStatisticDTO } from "./AttendanceStatisticDTO";
export type { ClassStatisticDTO } from "./ClassStatisticDTO";
export type { CounselingStatisticDTO } from "./CounselingStatisticDTO";
export type { DisabilityStatisticDTO } from "./DisabilityStatisticDTO";
export type { GenderStatisticDTO } from "./GenderStatisticDTO";
export type { StudentStatisticDTO } from "./StudentStatisticDTO";
export type { TopViolationStudentDTO } from "./TopViolationStudentDTO";
export type { ViolationHeatmapDTO } from "./ViolationHeatmapDTO";
export type { ViolationStatisticDTO } from "./ViolationStatisticDTO";
export type { ViolationTrendDTO } from "./ViolationTrendDTO";
