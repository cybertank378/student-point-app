//Files: src/modules/student-report/infrastructure/repo/StudentReportRepository.ts

import prisma from "@/libs/prisma";
import type {
  AttendanceStatisticDTO,
  ClassStatisticDTO,
  CounselingStatisticDTO,
  DisabilityStatisticDTO,
  GenderStatisticDTO,
  StudentStatisticDTO,
  TopViolationStudentDTO,
  ViolationHeatmapDTO,
  ViolationStatisticDTO,
  ViolationTrendDTO,
} from "@/modules/student-report/domain/dto";
import {
  AttendanceStatistic,
  ClassStatistic,
  CounselingStatistic,
  DisabilityStatistic,
  GenderStatistic,
  StudentStatistic,
  TopViolationStudent,
  ViolationHeatmap,
  ViolationStatistic,
  ViolationTrend,
} from "@/modules/student-report/domain/entity";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";
import { StudentReportMapper } from "@/modules/student-report/domain/mapper/StudentReportMapper";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentReportRepository
 *
 * @module student-report
 * @layer infrastructure
 * @since 2026
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Implementasi repository analytics siswa menggunakan
 * Prisma ORM.
 *
 * Repository ini bertanggung jawab untuk:
 *
 * 1. Mengambil data statistik siswa dari database
 * 2. Membuat entity domain analytics
 * 3. Melakukan mapping entity → DTO menggunakan mapper
 *
 * Repository ini merupakan:
 *
 * Single Source Of Truth untuk seluruh analytics siswa.
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
 * berbagai DTO statistik siswa
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const repo = new StudentReportRepository()
 * const stats = await repo.getStudentStatistic()
 *
 */

export class StudentReportRepository implements StudentReportInterface {
  async getStudentStatistic(): Promise<StudentStatisticDTO> {
    const totalStudents = await prisma.student.count({
      where: { deletedAt: null },
    });

    const activeStudents = await prisma.studentEnrollment.count({
      where: { status: "ACTIVE" },
    });

    const graduatedStudents = await prisma.studentEnrollment.count({
      where: { status: "GRADUATED" },
    });

    const transferredStudents = await prisma.studentEnrollment.count({
      where: { status: "PROMOTED" },
    });

    const entity = new StudentStatistic(totalStudents, activeStudents, graduatedStudents, transferredStudents);

    return StudentReportMapper.toStudentStatistic(entity);
  }

  async getGenderStatistic(): Promise<GenderStatisticDTO> {
    const [male, female] = await Promise.all([
      prisma.student.count({
        where: { gender: "MALE", deletedAt: null },
      }),
      prisma.student.count({
        where: { gender: "FEMALE", deletedAt: null },
      }),
    ]);

    const entity = new GenderStatistic(male, female);

    return StudentReportMapper.toGenderStatistic(entity);
  }

  async getClassStatistics(): Promise<ClassStatisticDTO[]> {
    const rows = await prisma.studentEnrollment.groupBy({
      by: ["classId"],
      _count: { classId: true },
    });

    const classes = await prisma.class.findMany({
      select: { id: true, name: true },
    });

    return rows.map((r) => {
      const cls = classes.find((c) => c.id === r.classId);

      const entity = new ClassStatistic(r.classId, cls?.name ?? "", r._count.classId);

      return StudentReportMapper.toClassStatistic(entity);
    });
  }

  async getDisabilityStatistic(): Promise<DisabilityStatisticDTO> {
    const [totalStudents, difableStudents] = await Promise.all([
      prisma.student.count({
        where: { deletedAt: null },
      }),
      prisma.student.count({
        where: {
          deletedAt: null,
          isDifable: true,
        },
      }),
    ]);

    const entity = new DisabilityStatistic(difableStudents, totalStudents);

    return StudentReportMapper.toDisabilityStatistic(entity);
  }
  async getViolationStatistic(): Promise<ViolationStatisticDTO> {
    const totalViolations = await prisma.studentViolation.count();

    const totalPoints = await prisma.studentPoint.aggregate({
      _sum: { totalViolationPoint: true },
    });

    const entity = new ViolationStatistic(totalViolations, totalPoints._sum.totalViolationPoint ?? 0);

    return StudentReportMapper.toViolationStatistic(entity);
  }

  async getCounselingStatistic(): Promise<CounselingStatisticDTO> {
    const totalSessions = await prisma.counselingCase.count();

    const resolvedCases = await prisma.counselingCase.count({
      where: { status: "CLOSED" },
    });

    const ongoingCases = await prisma.counselingCase.count({
      where: { status: "IN_PROGRESS" },
    });

    const entity = new CounselingStatistic(totalSessions, resolvedCases, ongoingCases);

    return StudentReportMapper.toCounselingStatistic(entity);
  }

  async getAttendanceStatistic(): Promise<AttendanceStatisticDTO> {
    const totalAttendance = await prisma.studentAttendance.count();

    const present = await prisma.studentAttendance.count({
      where: { status: "IZIN" },
    });

    const absent = await prisma.studentAttendance.count({
      where: { status: "ALPHA" },
    });

    const late = await prisma.studentAttendance.count({
      where: { status: "SAKIT" },
    });

    const entity = new AttendanceStatistic(totalAttendance, present, absent, late);

    return StudentReportMapper.toAttendanceStatistic(entity);
  }

  async getTopViolationStudents(limit = 10): Promise<TopViolationStudentDTO[]> {
    const rows = await prisma.studentPoint.findMany({
      orderBy: { totalViolationPoint: "desc" },
      take: limit,
      include: { student: true },
    });

    return rows.map((r) => {
      const entity = new TopViolationStudent(r.studentId, r.student.name, r.totalViolationPoint);

      return StudentReportMapper.toTopViolationStudent(entity);
    });
  }

  async getViolationHeatmap(): Promise<ViolationHeatmapDTO[]> {
    const rows = await prisma.studentViolation.groupBy({
      by: ["studentId"],
      _count: true,
    });

    return rows.map((r) => {
      const entity = new ViolationHeatmap(r.studentId, "", r._count);

      return StudentReportMapper.toViolationHeatmap(entity);
    });
  }

  async getViolationTrend(): Promise<ViolationTrendDTO[]> {
    const rows = await prisma.studentViolation.findMany({
      select: { occurredAt: true },
    });

    const map = new Map<string, number>();

    rows.forEach((r) => {
      const month = r.occurredAt.toISOString().slice(0, 7);

      map.set(month, (map.get(month) ?? 0) + 1);
    });

    return Array.from(map.entries()).map(([month, total]) => {
      const entity = new ViolationTrend(month, total);

      return StudentReportMapper.toViolationTrend(entity);
    });
  }
}
