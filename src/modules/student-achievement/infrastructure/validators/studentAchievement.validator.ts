import { z } from "zod";
import { UUID_REGEX } from "@/libs/utils";

/**
 * ============================================================
 * CREATE STUDENT ACHIEVEMENT SCHEMA
 * ============================================================
 */

export const CreateStudentAchievementSchema = z.object({
  achievementId: z.string().regex(UUID_REGEX),
  academicYearId: z.string().regex(UUID_REGEX),

  point: z.number().int().min(0),

  achievedAt: z.coerce.date(),
});

/**
 * ============================================================
 * REMOVE STUDENT ACHIEVEMENT SCHEMA
 * ============================================================
 */

export const RemoveStudentAchievementSchema = z.object({
  achievementId: z.string().uuid(),
});
