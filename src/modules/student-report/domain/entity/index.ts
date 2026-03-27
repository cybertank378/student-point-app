//Files: src/modules/student-report/domain/entity/index.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Report Entity Barrel
 *
 * @module student-report
 * @layer domain
 * @since 2026
 * @version 1.0.0
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Barrel file ini mengekspor seluruh entity yang digunakan
 * pada domain layer module student-report.
 *
 * Tujuan penggunaan barrel:
 *
 * - menyederhanakan import
 * - menghindari deep import path
 * - menjaga DRY pada struktur project
 * - meningkatkan maintainability pada project skala besar
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
 * seluruh entity student-report
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * import { StudentStatistic } from "@/modules/student-report/domain/entity"
 *
 */

export { AttendanceStatistic } from "./AttendanceStatistic";
export { ClassStatistic } from "./ClassStatistic";
export { CounselingStatistic } from "./CounselingStatistic";
export { DisabilityStatistic } from "./DisabilityStatistic";
export { GenderStatistic } from "./GenderStatistic";
export { StudentStatistic } from "./StudentStatistic";
export { TopViolationStudent } from "./TopViolationStudent";
export { ViolationHeatmap } from "./ViolationHeatmap";
export { ViolationStatistic } from "./ViolationStatistic";
export { ViolationTrend } from "./ViolationTrend";
