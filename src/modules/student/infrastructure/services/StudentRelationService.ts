//Files: src/modules/student/infrastructure/services/StudentRelationService.ts

import type { Prisma } from "@/generated/prisma";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto";

/**
 * ============================================================
 * STUDENT RELATION SERVICE
 * ============================================================
 *
 * Bertanggung jawab membuat semua relasi siswa:
 *
 * - Profile
 * - Facility
 * - Family
 * - Parent Relation
 * - Enrollment
 * - Student Aid
 *
 * Prinsip:
 * - SRP → hanya menangani relasi
 * - DRY → semua relasi disatukan
 *
 * Layer:
 * Infrastructure Service
 */
export class StudentRelationService {
  /**
   * Membuat seluruh relasi siswa.
   *
   * @param tx Prisma Transaction Client
   * @param studentId ID siswa
   * @param item DTO siswa
   * @param parentMap Map phone → parentId
   */
  static async insertRelations(
    tx: Prisma.TransactionClient,
    studentId: string,
    item: BulkImportStudentDTO,
    parentMap: Map<string, string>
  ) {
    if (item.profile) {
      await tx.studentProfile.create({
        data: { studentId, ...item.profile },
      });
    }

    await tx.studentFacility.create({
      data: {
        studentId,
        hasPC: item.facility.hasPC ?? false,
        hasLaptop: item.facility.hasLaptop ?? false,
        hasPhone: item.facility.hasPhone ?? false,
        internetAccess: item.facility.internetAccess ?? "",
      },
    });

    if (item.family) {
      await tx.studentFamilyInfo.create({
        data: {
          studentId,
          livingWith: item.family.livingWith ?? "",
          houseOwnership: item.family.houseOwnership!,
          headOfFamilyName: item.family.headOfFamilyName ?? "",
          familyCardAddress: item.family.familyCardAddress ?? "",
        },
      });
    }

    if (item.parents?.length) {
      await tx.studentParent.createMany({
        data: item.parents.map((p) => ({
          studentId,
          parentId: parentMap.get(p.phone)!,
          role: p.role,
        })),
      });
    }

    if (item.enrollment) {
      await tx.studentEnrollment.create({
        data: {
          studentId,
          academicYearId: item.enrollment.academicYearId,
          classId: item.enrollment.classId,
          status: item.enrollment.status ?? "ACTIVE",
        },
      });
    }

    if (item.aids?.length) {
      await tx.studentAid.createMany({
        data: item.aids.map((a) => ({
          studentId,
          ...a,
        })),
      });
    }
  }
}
