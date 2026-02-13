//Files: src/app/api/students/_factory.ts

import { StudentController } from "@/modules/student/infrastructure/http/StudentController";
import { StudentService } from "@/modules/student/application/services/StudentService";
import { StudentRepository } from "@/modules/student/infrastructure/repo/StudentRepository";
import {AcademicYearRepository} from "@/modules/academic-year/infrastructure/repo/AcademicYearRepository";

export function createStudentController() {
    const repo = new StudentRepository();
    const academicYearRepo = new AcademicYearRepository();
    const service = new StudentService(repo, academicYearRepo);
    return new StudentController(service);
}
