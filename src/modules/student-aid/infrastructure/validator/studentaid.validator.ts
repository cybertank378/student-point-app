//Files: src/modules/student-aid/infrastructure/validator/studentaid.validator.ts

import { z } from "zod";
import {BaseStudentAidValidator} from "@/modules/student-aid/infrastructure/validator/base.studentaid.validator";


/**
 * ============================================================
 * STUDENT AID VALIDATION SCHEMA
 * ============================================================
 *
 * Compose endpoint validation rules
 * using base validator fields.
 */

export const CreateStudentAidSchema = z.object({

    academicYearId:
    BaseStudentAidValidator.academicYearId,

    kjp:
    BaseStudentAidValidator.kjp,

    pip:
    BaseStudentAidValidator.pip

});

export const UpdateStudentAidSchema = z.object({

    id:
    BaseStudentAidValidator.id,

    academicYearId:
    BaseStudentAidValidator.academicYearId,

    kjp:
    BaseStudentAidValidator.kjp,

    pip:
    BaseStudentAidValidator.pip

});