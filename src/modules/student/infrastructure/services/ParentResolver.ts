//Files: src/modules/student/infrastructure/services/ParentResolver.ts

import type { Prisma } from "@/generated/prisma";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto";

/**
 * ============================================================
 * PARENT RESOLVER
 * ============================================================
 *
 * Bertanggung jawab untuk:
 * - Mengambil semua parent berdasarkan nomor telepon
 * - Membuat parent baru jika belum ada
 * - Menghasilkan Map phone → parentId
 *
 * Tujuan utama:
 * Menghindari N+1 query ketika proses import siswa.
 *
 * Prinsip:
 * - SRP → hanya menangani resolusi parent
 * - DRY → logic parent hanya ada di satu tempat
 * - KISS → implementasi sederhana
 *
 * Layer:
 * Infrastructure Service
 */
export class ParentResolver {
  /**
   * Menghasilkan Map phone → parentId
   *
   * @param tx Prisma Transaction Client
   * @param data DTO import siswa
   * @returns Map<string, string>
   */
  static async resolve(tx: Prisma.TransactionClient, data: BulkImportStudentDTO[]): Promise<Map<string, string>> {
    const phones = data.flatMap((d) => d.parents ?? []).map((p) => p.phone);

    const uniquePhones = [...new Set(phones)];

    if (uniquePhones.length === 0) {
      return new Map();
    }

    const existing = await tx.parent.findMany({
      where: { phone: { in: uniquePhones } },
      select: { id: true, phone: true },
    });

    const parentMap = new Map(existing.map((p) => [p.phone, p.id]));

    const missingParents = data.flatMap((d) => d.parents ?? []).filter((p) => !parentMap.has(p.phone));

    if (missingParents.length) {
      await tx.parent.createMany({
        data: missingParents.map((p) => ({
          name: p.name,
          phone: p.phone,
          education: p.education,
          job: p.job,
          income: p.income,
          religionCode: p.religionCode,
          address: p.address,
          guardianRelation: p.guardianRelation,
        })),
        skipDuplicates: true,
      });
    }

    const allParents = await tx.parent.findMany({
      where: { phone: { in: uniquePhones } },
      select: { id: true, phone: true },
    });

    return new Map(allParents.map((p) => [p.phone, p.id]));
  }
}
