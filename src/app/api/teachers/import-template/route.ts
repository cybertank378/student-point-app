//Files: src/app/api/teachers/import-template/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
    const controller = createTeacherController();
    return controller.importTemplate();
}