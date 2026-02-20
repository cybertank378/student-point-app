//Files: src/app/api/teachers/_factory.ts

import { TeacherRepository } from "@/modules/teacher/infrastructure/repo/TeacherRepository";
import { TeacherService } from "@/modules/teacher/application/services/TeacherService";
import {TeacherController} from "@/modules/teacher/infrastructure/http/TeacherController";


/**
 * ============================================================
 * TEACHER CONTROLLER FACTORY
 * ============================================================
 *
 * Factory function untuk membuat instance TeacherController
 * lengkap dengan dependency injection.
 *
 * Tujuan:
 * - Menghindari duplikasi instansiasi Repository & Service
 * - Menjaga route.ts tetap bersih
 * - Mendukung clean architecture
 *
 * Flow:
 * Repository → Service → Controller
 *
 * Catatan:
 * Tidak ada business logic di sini.
 */

export const createTeacherController = () => {
    const repo = new TeacherRepository();
    const service = new TeacherService(repo);
    return new TeacherController(service);
};