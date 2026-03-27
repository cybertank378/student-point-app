//Files : src/modules/student-composite/infrastructure/repo/StudentCompositeRepository.ts
import prisma from "@/libs/prisma";
import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";

import { studentCompositeSelect } from "@/modules/student-composite/domain/builder/StudentCompositeQuery";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import type { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";
import { StudentCompositeMapper } from "@/modules/student-composite/domain/mapper/StudentCompositeMapper";
import type { StudentCollectionKey } from "@/modules/student-composite/domain/types/StudentCollectionKey";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";
import { Prisma } from "@/generated/prisma";
import { EnrollmentStatus } from "@/libs/utils/enums";

/**
 * ============================================================
 * STUDENT COMPOSITE REPOSITORY
 * ============================================================
 *
 * Implementasi repository untuk mengambil
 * data komposit siswa menggunakan Prisma.
 *
 * Layer:
 *
 * Infrastructure
 *
 * Repository ini bertugas:
 *
 * - Mengambil data komposit siswa
 * - Mengambil daftar siswa (list view)
 * - Mengambil koleksi child module siswa
 *
 * Repository ini **tidak mengandung business logic**.
 */

export class StudentCompositeRepository implements StudentCompositeInterface {
  /**
   * ============================================================
   * FIND STUDENT COMPOSITE BY ID
   * ============================================================
   */

  async findById(studentId: string): Promise<StudentCompositeDTO | null> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },

      select: studentCompositeSelect,
    });
    if (!student) return null;

    return StudentCompositeMapper.toDTO(student);
  }

  /**
   * ============================================================
   * FIND STUDENT LIST
   * ============================================================
   */

  async findStudentList(
      params: StudentListParams
  ): Promise<BasePaginationResponse<StudentListCompositeDTO>> {


    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    /* =========================================================
     STUDENT FILTER
     ========================================================= */

    const studentWhere: Prisma.StudentWhereInput = {
      deletedAt: null,

      ...(params.search && {
        name: {
          contains: params.search,
          mode: "insensitive"
        }
      }),

      ...(params.isDifable !== undefined && {
        isDifable: params.isDifable
      }),

      ...(params.classId || params.status
          ? {
            enrollments: {
              some: {
                deletedAt: null,
                status: EnrollmentStatus.ACTIVE,

                ...(params.classId && {
                  classId: params.classId
                })
              }
            }
          }
          : {})
    };

    /* =========================================================
     QUERY 1 — STUDENTS
     ========================================================= */

    const [students, total] = await Promise.all ([
      prisma.student.findMany ({
        where: studentWhere,

        select: {
          id: true,
          nis: true,
          nisn: true,
          name: true,
          nickname: true,
          photo: true,
          gender: true,
          religionCode: true,
          familyStatus: true,
          isDifable: true,
          schoolOrigin: true,
          createdAt: true
        },

        skip,
        take: limit
      }),

      prisma.student.count ({
        where: studentWhere
      })
    ]);

    const studentIds = students.map ((s) => s.id);

    if (studentIds.length === 0) {
      return {
        data: [],
        total,
        page,
        limit,
        totalPages: Math.ceil (total / limit)
      };
    }

    /* =========================================================
     QUERY 2 — ENROLLMENTS
     ========================================================= */

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentId: { in: studentIds },
        deletedAt: null,
        status: EnrollmentStatus.ACTIVE,

        ...(params.classId && {
          classId: params.classId
        })
      },

      select: {
        studentId: true,
        academicYearId: true,
        status: true,

        academicYear: {
          select: { name: true }
        },

        class: {
          select: {
            id: true,
            name: true,
            grade: true
          }
        }
      }
    })

    /* =========================================================
     QUERY 3 — POINT SUMMARY
     ========================================================= */

    const points = await prisma.studentPoint.findMany ({
      where: {
        studentId: {in: studentIds}
      },

      orderBy: {
        academicYearId: "desc"
      },

      select: {
        studentId: true,
        academicYearId: true,
        totalViolationPoint: true,
        totalAchievementPoint: true,
        totalPoint: true,
        updatedAt: true
      }
    });

    /* =========================================================
     MAP RELATIONS
     ========================================================= */

    const enrollmentMap = new Map<string, typeof enrollments[number]>()

    for (const e of enrollments) {
      enrollmentMap.set(e.studentId, e)
    }

    const pointMap = new Map<string, typeof points[number]> ();
    for (const p of points) {
      if (!pointMap.has (p.studentId)) {
        pointMap.set (p.studentId, p);
      }
    }

    /* =========================================================
     BUILD DTO
     ========================================================= */

    const data: StudentListCompositeDTO[] = students.map ((student) => {

      const enrollment = enrollmentMap.get (student.id);
      const point = pointMap.get (student.id);

      return {
        id: student.id,
        nis: student.nis,
        nisn: student.nisn,
        name: student.name,
        nickname: student.nickname,
        photo: student.photo,
        gender: student.gender,
        religionCode: student.religionCode,
        familyStatus: student.familyStatus,
        isDifable: student.isDifable,
        schoolOrigin: student.schoolOrigin,
        createdAt: student.createdAt,

        enrollment: enrollment
            ? {
              academicYearId: enrollment.academicYearId,
              academicYearName: enrollment.academicYear?.name ?? null,
              classId: enrollment.class?.id ?? null,
              className: enrollment.class?.name ?? null,
              grade: enrollment.class?.grade ?? null,
              status: enrollment.status
            }
            : null,

        pointSummary: point
            ? {
              academicYearId: point.academicYearId,
              totalViolationPoint: point.totalViolationPoint,
              totalAchievementPoint: point.totalAchievementPoint,
              totalPoint: point.totalPoint,
              updatedAt: point.updatedAt
            }
            : null
      };
    });

    /* =========================================================
     RETURN RESPONSE
     ========================================================= */

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil (total / limit)
    };
  }

  /**
   * ============================================================
   * LIST STUDENT COLLECTION
   * ============================================================
   */

  async listStudentCollection<K extends StudentCollectionKey>(
    studentId: string,
    collection: K,
    params: BasePaginationParams
  ): Promise<BasePaginationResponse<StudentCompositeDTO[K][number]>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const queries = {
      aids: () =>
        prisma.studentAid.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      achievements: () =>
        prisma.studentAchievement.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      attendances: () =>
        prisma.studentAttendance.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      enrollments: () =>
        prisma.studentEnrollment.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      point: () =>
        prisma.studentPoint.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      parents: () =>
        prisma.studentParent.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      violations: () =>
        prisma.studentViolation.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),

      counselingCases: () =>
        prisma.counselingCase.findMany({
          where: { studentId },
          skip,
          take: limit,
        }),
    } as const;

    const counters = {
      aids: () => prisma.studentAid.count({ where: { studentId } }),

      achievements: () => prisma.studentAchievement.count({ where: { studentId } }),

      attendances: () => prisma.studentAttendance.count({ where: { studentId } }),

      enrollments: () => prisma.studentEnrollment.count({ where: { studentId } }),

      point: () => prisma.studentPoint.count({ where: { studentId } }),

      parents: () => prisma.studentParent.count({ where: { studentId } }),

      violations: () => prisma.studentViolation.count({ where: { studentId } }),

      counselingCases: () => prisma.counselingCase.count({ where: { studentId } }),
    } as const;

    const [data, total] = await Promise.all([queries[collection](), counters[collection]()]);

    return {
      data: data as ReadonlyArray<StudentCompositeDTO[K][number]>,

      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
