//Files: src/modules/teacher/domain/entity/Teacher.ts


import type {TeacherRole} from "@/libs/utils";

export class Teacher {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public nip: string,
        public name: string,
        public phone: string | null,
        public email: string | null,
        public roles: TeacherRole[],
        public homeroomClassId: string | null,
    ) {}

    isHomeroom(): boolean {
        return this.roles.includes("HOMEROOM");
    }

}

