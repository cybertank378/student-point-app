//Files: src/modules/teacher/domain/entity/Teacher.ts

import {TeacherRoleLiteral} from "@/modules/teacher/domain/constants/TeacherRole";

export class Teacher {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public nip: string,
        public name: string,
        public phone: string | null,
        public email: string | null,
        public roles: TeacherRoleLiteral[],
        public homeroomClassId: string | null,
    ) {}

    isHomeroom(): boolean {
        return this.roles.includes("HOMEROOM");
    }

}

