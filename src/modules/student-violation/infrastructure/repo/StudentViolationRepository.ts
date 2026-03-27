// Files: src/modules/student-violation/infrastructure/repo/StudentViolationRepository.ts
import prisma from "@/libs/prisma";
import type { ViolationActionType, ViolationResolutionStatus } from "@/libs/utils/enums";
import { StudentViolationBuilder } from "@/modules/student-violation/domain/builder/StudentViolationBuilder";
import type { StudentViolation } from "@/modules/student-violation/domain/entity/StudentViolation";
import type { StudentViolationInterface } from "@/modules/student-violation/domain/interfaces/StudentViolationInterface";

/**
 * ============================================================
 * STUDENT VIOLATION REPOSITORY
 * ============================================================
 *
 * Repository ini bertanggung jawab untuk menangani
 * seluruh operasi persistensi terhadap aggregate
 * **StudentViolation** menggunakan Prisma ORM.
 *
 * Peran dalam arsitektur:
 * - Infrastructure Adapter (Hexagonal Architecture)
 * - Implementasi dari StudentViolationInterface
 *
 * Tanggung jawab utama:
 * - Menyimpan pelanggaran siswa
 * - Mengambil data pelanggaran dari database
 * - Menjalankan proses penyelesaian pelanggaran
 *
 * Catatan Penting:
 * Repository **tidak melakukan mapping langsung**
 * dari persistence record ke domain entity.
 *
 * Proses rekonstruksi aggregate dilakukan oleh:
 *
 * `StudentViolationBuilder`
 *
 * Builder tersebut sudah menggunakan mapper berikut:
 *
 * - StudentViolationMapper
 * - ViolationResolutionMapper
 * - ViolationActionLogMapper
 *
 * Sehingga repository hanya bertanggung jawab
 * untuk mengambil data dari database dan
 * menyerahkannya ke builder.
 */
export class StudentViolationRepository implements StudentViolationInterface {
  /**
   * ============================================================
   * SIMPAN DATA PELANGGARAN SISWA
   * ============================================================
   *
   * Menyimpan entity StudentViolation ke database.
   *
   * @param violation
   * Entity pelanggaran siswa yang akan disimpan.
   */
  async save(violation: StudentViolation): Promise<void> {
    await prisma.studentViolation.create({
      data: {
        studentId: violation.studentId,
        violationId: violation.violationId,
        academicYearId: violation.academicYearId,
        point: violation.point,
        occurredAt: violation.occurredAt,
        createdAt: violation.createdAt,
      },
    });
  }

  /**
   * ============================================================
   * AMBIL PELANGGARAN BERDASARKAN ID
   * ============================================================
   *
   * Mengambil satu aggregate StudentViolation
   * berdasarkan identifier pelanggaran.
   *
   * Data yang diambil termasuk:
   * - ViolationResolution
   * - ViolationActionLogs
   *
   * Rekonstruksi aggregate dilakukan oleh
   * `StudentViolationBuilder`.
   *
   * @param violationId
   * ID pelanggaran siswa.
   *
   * @returns
   * StudentViolation aggregate atau null.
   */
  async findById(violationId: string): Promise<StudentViolation | null> {
    const row = await prisma.studentViolation.findUnique({
      where: { id: violationId },
      include: {
        resolution: {
          include: {
            logs: true,
          },
        },
      },
    });

    if (!row) {
      return null;
    }

    /**
     * Mapping dilakukan oleh Builder.
     * Builder sudah menggunakan Mapper domain.
     */
    return StudentViolationBuilder.build(row);
  }

  /**
   * ============================================================
   * AMBIL RIWAYAT PELANGGARAN SISWA
   * ============================================================
   *
   * Mengambil seluruh pelanggaran milik seorang siswa.
   *
   * Data diurutkan berdasarkan waktu kejadian terbaru.
   *
   * @param studentId
   * ID siswa.
   *
   * @returns
   * Daftar StudentViolation aggregate.
   */
  async findByStudentId(studentId: string): Promise<StudentViolation[]> {
    const rows = await prisma.studentViolation.findMany({
      where: { studentId },
      include: {
        resolution: {
          include: {
            logs: true,
          },
        },
      },
      orderBy: {
        occurredAt: "desc",
      },
    });

    /**
     * Aggregate reconstruction melalui builder.
     */
    return rows.map(StudentViolationBuilder.build);
  }

  /**
   * ============================================================
   * AMBIL PELANGGARAN SISWA BERDASARKAN TAHUN AJARAN
   * ============================================================
   *
   * Mengambil seluruh pelanggaran seorang siswa
   * dalam tahun ajaran tertentu.
   *
   * @param studentId
   * ID siswa
   *
   * @param academicYearId
   * ID tahun ajaran
   *
   * @returns
   * Daftar StudentViolation aggregate.
   */
  async findByAcademicYear(studentId: string, academicYearId: string): Promise<StudentViolation[]> {
    const rows = await prisma.studentViolation.findMany({
      where: {
        studentId,
        academicYearId,
      },
      include: {
        resolution: {
          include: {
            logs: true,
          },
        },
      },
      orderBy: {
        occurredAt: "desc",
      },
    });

    return rows.map(StudentViolationBuilder.build);
  }

  /**
   * ============================================================
   * PROSES PENYELESAIAN PELANGGARAN
   * ============================================================
   *
   * Menandai pelanggaran sebagai telah ditangani
   * oleh guru serta mencatat tindakan disiplin.
   *
   * Operasi dilakukan dalam satu transaksi agar
   * seluruh perubahan bersifat atomic.
   *
   * Langkah transaksi:
   * 1. Mengambil data ViolationResolution
   * 2. Memperbarui status resolusi
   * 3. Menambahkan log tindakan disiplin
   *
   * @param violationId
   * ID pelanggaran siswa
   *
   * @param handlerTeacherId
   * ID guru yang menangani
   *
   * @param status
   * Status resolusi pelanggaran
   *
   * @param action
   * Jenis tindakan disiplin
   *
   * @param note
   * Catatan tambahan
   */
  async resolveViolation(
    violationId: string,
    handlerTeacherId: string,
    status: ViolationResolutionStatus,
    action: ViolationActionType,
    note: string | null
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const resolution = await tx.violationResolution.findUnique({
        where: {
          studentViolationId: violationId,
        },
      });

      if (!resolution) {
        throw new Error("Violation resolution tidak ditemukan");
      }

      await tx.violationResolution.update({
        where: {
          studentViolationId: violationId,
        },
        data: {
          handlerTeacherId,
          status,
          action,
          note,
          resolvedAt: status === "RESOLVED" ? new Date() : null,
        },
      });

      await tx.violationActionLog.create({
        data: {
          resolutionId: resolution.id,
          action,
          note,
        },
      });
    });
  }
}
