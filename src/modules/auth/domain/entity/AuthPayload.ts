//Files: src/modules/auth/domain/entity/AuthPayload.ts

import { JWTPayload } from "jose";
import { UserRole, TeacherRole } from "@/libs/utils";

export interface AuthPayload extends JWTPayload {
    sub: string;
    username: string;
    role: UserRole;
    teacherRole?: TeacherRole;
}
