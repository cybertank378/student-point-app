// Files: src/modules/student/application/helpers/studentValidation.helper.ts
// Files: src/modules/student/application/helpers/studentValidation.helper.ts

import { AppError } from "@/modules/shared/errors/AppError";

/**
 * ============================================================
 * STUDENT VALIDATION HELPER
 * ============================================================
 *
 * Berisi validasi reusable untuk use case student.
 * Tidak ada akses database di sini.
 */

export function validateAcademicYear(
    academicYearId?: string
): void {
    if (!academicYearId) {
        throw AppError.badRequest(
            "Tahun ajaran wajib diisi."
        );
    }
}

export function validatePagination(
    page?: number,
    limit?: number
): void {

    if (page !== undefined && page <= 0) {
        throw AppError.badRequest(
            "Halaman harus lebih dari 0."
        );
    }

    if (limit !== undefined && limit <= 0) {
        throw AppError.badRequest(
            "Batas data per halaman harus lebih dari 0."
        );
    }
}

export function validateEnrollmentConsistency(
    academicYearId?: string,
    classId?: string
): void {

    if (classId && !academicYearId) {
        throw AppError.badRequest(
            "Tahun ajaran wajib diisi ketika memfilter berdasarkan kelas."
        );
    }
}