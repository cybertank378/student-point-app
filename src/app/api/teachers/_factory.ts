//Files: src/app/api/teachers/_factory.ts

import {TeacherRepository} from "@/modules/teacher/infrastructure/repo/TeacherRepository";
import {TeacherService} from "@/modules/teacher/application/services/TeacherService";
import {TeacherController} from "@/modules/teacher/infrastructure/http/TeacherController";
import {LocalFileStorageService} from "@/modules/shared/http/interface/LocalFileStorageService";
import {ExcelAdapter} from "@/modules/shared/core/ExcelAdapter";
import {TeacherExcelMapper} from "@/modules/teacher/domain/mapper/TeacherExcelMapper";


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
    const fileRepo = new LocalFileStorageService();
    const service = new TeacherService(repo, fileRepo);
    const excel = new ExcelAdapter;
    const mapper= new TeacherExcelMapper;
    return new TeacherController(service, excel, mapper);
};