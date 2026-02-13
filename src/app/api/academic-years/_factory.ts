//Files: src/app/api/academic-years/_factory.ts

import { AcademicYearController } from "@/modules/academic-year/infrastructure/http/AcademicYearController";
import { AcademicYearService } from "@/modules/academic-year/application/services/AcademicYearService";
import { AcademicYearRepository } from "@/modules/academic-year/infrastructure/repo/AcademicYearRepository";

/**
 * Factory: AcademicYearController
 */
export function createAcademicYearController(): AcademicYearController {
    const repo = new AcademicYearRepository();
    const service = new AcademicYearService(repo);

    return new AcademicYearController(service);
}
