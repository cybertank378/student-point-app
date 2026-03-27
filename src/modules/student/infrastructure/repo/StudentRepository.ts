// src/modules/student/infrastructure/repository/StudentRepository.ts

import prisma from "@/libs/prisma";
import { StatisticQueryBuilder } from "@/modules/student/domain/builder/StatisticQueryBuilder";
import { buildCreateStudentPayload, buildUpdateStudentPayload } from "@/modules/student/domain/builder/StudentPayloadBuilder";
import type {
  BulkImportStudentDTO,
  CreateStudentDTO,
  DeleteStudentDTO,
  StudentIdentityDTO,
  StudentStatisticDTO,
  UpdateStudentDTO,
} from "@/modules/student/domain/dto";
import type { StudentEntity } from "@/modules/student/domain/entity/Student";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import { StudentMapper } from "@/modules/student/domain/mapper/StudentMapper";
import { StudentImportService } from "@/modules/student/infrastructure/services/StudentImportService";
import { teacherInclude } from "@/modules/teacher/domain/mapper/PayloadBuilder";

/**
 * ============================================================
 * STUDENT REPOSITORY
 * ============================================================
 *
 * Implementation repository untuk entity Student.
 *
 * Layer:
 * Infrastructure
 */
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export class StudentRepository implements StudentInterface {
  /**
   * ============================================================
   * CREATE STUDENT
   * ============================================================
   */
  async create(dto: CreateStudentDTO): Promise<StudentEntity> {
    const created = await prisma.student.create({
      data: buildCreateStudentPayload(dto),
      include: teacherInclude,
    });

    return StudentMapper.toDomain(created);
  }

  /**
   * ============================================================
   * UPDATE STUDENT
   * ============================================================
   */

  async update(data: UpdateStudentDTO): Promise<StudentIdentityDTO> {
    const payload = buildUpdateStudentPayload(data);

    const student = await prisma.student.update({
      where: { id: data.id },
      data: payload,
    });

    return {
      id: student.id,
      nis: student.nis,
      nisn: student.nisn,
    };
  }

  /**
   * ============================================================
   * DELETE STUDENT (SOFT DELETE)
   * ============================================================
   */

  async delete(data: DeleteStudentDTO): Promise<void> {
    await prisma.student.updateMany({
      where: { id: data.id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * ============================================================
   * FIND STUDENT BY ID
   * ============================================================
   */

  async findById(studentId: string): Promise<StudentIdentityDTO | null> {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
        deletedAt: null,
      },
      select: {
        id: true,
        nis: true,
        nisn: true,
      },
    });

    if (!student) return null;

    return student;
  }

  /**
   * ============================================================
   * FIND STUDENT BY ID
   * ============================================================
   */

  async findByNis(nis: string): Promise<StudentIdentityDTO | null> {
    const student = await prisma.student.findUnique({
      where: {
        nis: nis,
        deletedAt: null,
      },
      select: {
        id: true,
        nis: true,
        nisn: true,
      },
    });

    if (!student) return null;

    return student;
  }

  /**
   * ============================================================
   * CHECK EXISTING NISN
   * ============================================================
   */

  async existsByNISN(nisn: string): Promise<boolean> {
    const count = await prisma.student.count({
      where: {
        nisn,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  /**
   * ============================================================
   * CHECK EXISTING NIS
   * ============================================================
   */

  async existsByNIS(nis: string): Promise<boolean> {
    const count = await prisma.student.count({
      where: {
        nis,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  /**
   * ============================================================
   * BULK CREATE STUDENT
   * ============================================================
   *
   * Digunakan untuk proses import Excel.
   */
  async bulkImportCreate(data: BulkImportStudentDTO[]): Promise<number> {
    return StudentImportService.execute(data);
  }

  /**
   * ============================================================
   * STUDENT STATISTICS (DASHBOARD)
   * ============================================================
   */
  async getStudentStatistics(): Promise<StudentStatisticDTO> {
    /**
     * QUERY 1
     * TOTAL STUDENT
     */

    const totalStudents = await prisma.student.count(
        StatisticQueryBuilder.totalStudents
    );

    /**
     * QUERY 2
     * GRADE DISTRIBUTION
     */

    const gradeBuilder = StatisticQueryBuilder.gradeDistribution;

    const [gradeGroups, classes] = await Promise.all([
      prisma.studentEnrollment.groupBy(gradeBuilder),

      prisma.class.findMany({
        select: {
          id: true,
          grade: true,
          name: true,
        },
      }),
    ]);

    /**
     * CLASS MAP
     */

    const classMap = new Map(
        classes.map((c) => [
          c.id,
          {
            grade: c.grade,
            name: c.name,
          },
        ])
    );

    /**
     * GRADE MAPPING
     */

    const gradeMap: Record<string, "grade7" | "grade8" | "grade9"> = {
      VII: "grade7",
      VIII: "grade8",
      XI: "grade9", // database menggunakan XI
    };

    /**
     * TOTAL PER GRADE
     */

    let totalGrade7 = 0;
    let totalGrade8 = 0;
    let totalGrade9 = 0;

    for (const g of gradeGroups) {
      const meta = classMap.get(g.classId);

      const grade = meta?.grade ?? "";
      const total = g._count.studentId;

      if (gradeMap[grade] === "grade7") totalGrade7 += total;
      if (gradeMap[grade] === "grade8") totalGrade8 += total;
      if (gradeMap[grade] === "grade9") totalGrade9 += total;
    }

    /**
     * QUERY 3
     * VIOLATION DATA
     */

    const violations = await prisma.studentViolation.findMany(
        StatisticQueryBuilder.violations
    );

    /**
     * BUILD VIOLATION MAP
     */

    type MonthGradeViolation = {
      grade7: number;
      grade8: number;
      grade9: number;
      total: number;
    };

    const violationMap: Record<number, MonthGradeViolation> = {};

    for (let i = 1; i <= 12; i++) {
      violationMap[i] = {
        grade7: 0,
        grade8: 0,
        grade9: 0,
        total: 0,
      };
    }

    for (const v of violations) {
      const month = v.occurredAt.getMonth() + 1;

      const grade =
          v.student.enrollments[0]?.class.grade ?? null;

      violationMap[month].total++;

      if (!grade) continue;

      const mapped = gradeMap[grade];

      if (mapped) {
        violationMap[month][mapped]++;
      }
    }

    /**
     * MONTHLY VIOLATION BY GRADE
     */

    const monthlyViolationByGrade = Object.entries(violationMap)
        .map(([month, data]) => ({
          month: Number(month),
          monthLabel: monthLabels[Number(month) - 1],

          grade7: data.grade7,
          grade8: data.grade8,
          grade9: data.grade9,
        }))
        .sort((a, b) => a.month - b.month);

    /**
     * VIOLATION TREND
     */

    const violationTrend = Object.entries(violationMap)
        .map(([month, data]) => ({
          month: Number(month),
          monthLabel: monthLabels[Number(month) - 1],
          totalViolations: data.total,
        }))
        .sort((a, b) => a.month - b.month);

    /**
     * FINAL RESULT
     */

    return {
      totalStudents,
      totalGrade7,
      totalGrade8,
      totalGrade9,
      monthlyViolationByGrade,
      violationTrend,
    };
  }
}
