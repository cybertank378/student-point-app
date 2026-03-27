//Files: src/modules/student-point/infrastructure/validators/student.point.validator.ts

import { z } from "zod";
import {UUID_REGEX} from "valibot";

export const GetStudentPointSummarySchema =
    z.object({

        studentId:
            z.string().regex(UUID_REGEX),

        academicYearId:
            z.string().regex(UUID_REGEX)

    });

export const ListStudentPointSummarySchema =
    z.object({

        academicYearId:
            z.string().regex(UUID_REGEX)

    });

export const RecalculateStudentPointSchema =
    z.object({

        academicYearId:
            z.string().regex(UUID_REGEX),

        violationPoint:
            z.number().int().min(0),

        achievementPoint:
            z.number().int().min(0)

    });