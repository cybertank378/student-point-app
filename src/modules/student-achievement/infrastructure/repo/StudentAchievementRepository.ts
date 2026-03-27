// Files: src/modules/student-achievement/infrastructure/repo/StudentAchievementRepository.ts

import prisma from "@/libs/prisma";
import type { AddStudentAchievementDTO } from "@/modules/student-achievement/domain/dto/AddStudentAchievementDTO";
import { StudentAchievement } from "@/modules/student-achievement/domain/entity/StudentAchievement";
import type { StudentAchievementInterface } from "@/modules/student-achievement/domain/interfaces/StudentAchievementInterface";
import { StudentAchievementMapper } from "@/modules/student-achievement/domain/mapper/StudentAchievementMapper";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT REPOSITORY
 * ============================================================
 *
 * Handles persistence for StudentAchievement entity.
 */

export class StudentAchievementRepository implements StudentAchievementInterface {
  async assign(data: AddStudentAchievementDTO): Promise<StudentAchievement> {
    const record = await prisma.studentAchievement.create({
      data: {
        studentId: data.studentId,
        achievementId: data.achievementId,
        academicYearId: data.academicYearId,
        point: data.point,
        achievedAt: data.achievedAt,
      },
    });

    return StudentAchievementMapper.fromPersistence(record);
  }

  async remove(id: string): Promise<void> {
    await prisma.studentAchievement.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<StudentAchievement | null> {
    const record = await prisma.studentAchievement.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return StudentAchievementMapper.fromComposite(id, record);
  }

  async findByAcademicYear(studentId: string, academicYearId: string): Promise<StudentAchievement[]> {
    const records = await prisma.studentAchievement.findMany({
      where: {
        studentId,
        academicYearId,
      },
    });

    return records.map((r) => new StudentAchievement(r));
  }
}
