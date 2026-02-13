//Files: src/modules/auth/domain/entity/AuthPayload.ts


import {TeacherRole, UserRole} from "@/libs/utils";

export interface AuthPayload {
    sub: string;
    role: UserRole;
    teacherRole?: TeacherRole;
}
