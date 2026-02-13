//Files: src/app/api/teachers/_factory.ts

import { TeacherRepository } from "@/modules/teacher/infrastructure/repo/TeacherRepository";
import { TeacherService } from "@/modules/teacher/application/services/TeacherService";
import {TeacherController} from "@/modules/teacher/infrastructure/http/http/TeacherController";

export function createTeacherController() {
    const repo = new TeacherRepository();
    const service = new TeacherService(repo);
    return new TeacherController(service);
}
