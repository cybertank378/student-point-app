//Files: src/modules/teacher/domain/mapper/TeacherMapper.ts

import type {
    Teacher as PrismaTeacher,
    Class as PrismaClass,
} from "@/generated/prisma";
import { Teacher } from "@/modules/teacher/domain/entity/Teacher";

type TeacherWithHomeroom = PrismaTeacher & {
    homeroomOf: PrismaClass | null;
};

export class TeacherMapper {
    static toDomain(row: TeacherWithHomeroom): Teacher {
        return new Teacher(
            row.id,
            row.userId,
            row.nip,
            row.name,
            row.phone,
            row.email,
            row.roles,
            row.homeroomOf ? row.homeroomOf.id : null,
        );
    }

    static toDomainList(rows: TeacherWithHomeroom[]): Teacher[] {
        return rows.map(this.toDomain);
    }
}


