//Files: src/modules/student/infrastructure/services/StudentImportService.ts

import prisma from "@/libs/prisma";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto";
import { ParentResolver } from "./ParentResolver";
import { StudentInsertService } from "./StudentInsertService";
import { StudentRelationService } from "./StudentRelationService";

/**
 * ============================================================
 * STUDENT IMPORT SERVICE
 * ============================================================
 *
 * Orchestrator untuk proses import siswa.
 *
 * Bertanggung jawab untuk:
 * - menjalankan transaction
 * - memanggil resolver parent
 * - membuat siswa
 * - membuat relasi siswa
 *
 * Prinsip:
 * - SRP → orchestration import
 * - KISS → flow sederhana
 * - DRY → logic dipisah ke service lain
 *
 * Layer:
 * Infrastructure Service
 */
export class StudentImportService {
  /**
   * Menjalankan proses import siswa secara transactional.
   *
   * @param data DTO import siswa
   * @returns jumlah siswa yang berhasil diinsert
   */
  static async execute(data: BulkImportStudentDTO[]): Promise<number> {
    return prisma.$transaction(async (tx) => {
      const parentMap = await ParentResolver.resolve(tx, data);

      let inserted = 0;

      for (const item of data) {
        const student = await StudentInsertService.createStudent(tx, item);

        await StudentRelationService.insertRelations(tx, student.id, item, parentMap);

        inserted++;
      }

      return inserted;
    });
  }
}
