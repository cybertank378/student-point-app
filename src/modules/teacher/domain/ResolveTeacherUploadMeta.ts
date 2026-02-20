//Files: src/modules/teacher/domain/ResolveTeacherUploadMeta.ts

import {Teacher} from "@/modules/teacher/domain/entity/Teacher";

export function resolveTeacherUploadMeta(teacher: Teacher) {
    const folder = "teachers";

    const identity =
        teacher.nip ??
        teacher.nuptk ??
        teacher.nrk ??
        teacher.nrg ??
        teacher.id;

    return { folder, identity };
}