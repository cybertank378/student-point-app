//Files: src/modules/student-report/domain/mapper/StudentReportMapper.ts

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
import type {
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

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentReportMapper
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
 * Mapper ini bertanggung jawab untuk mengubah entity
 * statistik domain menjadi DTO yang digunakan oleh
 * application layer atau presentation layer.
 *
 * Mapper ini menjaga agar:
 *
 * - Domain Entity tidak diekspos langsung ke luar layer
 * - DTO menjadi kontrak data yang stabil
 *
 * Prinsip desain:
 *
 * - SRP → hanya melakukan mapping
 * - DRY → semua mapping berada dalam satu tempat
 * - KISS → tidak ada logika bisnis
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param entity entity statistik domain
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * DTO statistik yang siap digunakan oleh layer lain
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const dto = StudentReportMapper.toStudentStatistic(entity)
 *
 */

export class StudentReportMapper {
  static toStudentStatistic(entity: StudentStatistic): StudentStatisticDTO {
    return {
      totalStudents: entity.totalStudents,
      activeStudents: entity.activeStudents,
      graduatedStudents: entity.graduatedStudents,
      transferredStudents: entity.transferredStudents,
    };
  }

  static toGenderStatistic(entity: GenderStatistic): GenderStatisticDTO {
    return {
      maleStudents: entity.maleStudents,
      femaleStudents: entity.femaleStudents,
    };
  }

  static toClassStatistic(entity: ClassStatistic): ClassStatisticDTO {
    return {
      classId: entity.classId,
      className: entity.className,
      totalStudents: entity.totalStudents,
    };
  }

  static toDisabilityStatistic(entity: DisabilityStatistic): DisabilityStatisticDTO {
    return {
      difableStudents: entity.difableStudents,
      totalStudents: entity.totalStudents,
      percentage: Number(entity.percentage.toFixed(2)),
    };
  }

  static toViolationStatistic(entity: ViolationStatistic): ViolationStatisticDTO {
    return {
      totalViolations: entity.totalViolations,
      totalPoints: entity.totalPoints,
    };
  }

  static toCounselingStatistic(entity: CounselingStatistic): CounselingStatisticDTO {
    return {
      totalSessions: entity.totalSessions,
      resolvedCases: entity.resolvedCases,
      ongoingCases: entity.ongoingCases,
    };
  }

  static toAttendanceStatistic(entity: AttendanceStatistic): AttendanceStatisticDTO {
    return {
      totalAttendance: entity.totalAttendance,
      present: entity.present,
      absent: entity.absent,
      late: entity.late,
    };
  }

  static toTopViolationStudent(entity: TopViolationStudent): TopViolationStudentDTO {
    return {
      studentId: entity.studentId,
      studentName: entity.studentName,
      totalPoints: entity.totalPoints,
    };
  }

  static toViolationHeatmap(entity: ViolationHeatmap): ViolationHeatmapDTO {
    return {
      classId: entity.classId,
      className: entity.className,
      totalViolations: entity.totalViolations,
    };
  }

  static toViolationTrend(entity: ViolationTrend): ViolationTrendDTO {
    return {
      month: entity.month,
      totalViolations: entity.totalViolations,
    };
  }
}
