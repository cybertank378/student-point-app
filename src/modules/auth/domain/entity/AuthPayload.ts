//Files: src/modules/auth/domain/entity/AuthPayload.ts

import type { JWTPayload } from "jose";
import type { UserRole, TeacherRole } from "@/libs/utils";

interface AuthPayload extends JWTPayload {
  sub: string;
  username: string;
  role: UserRole;
  teacherRole?: TeacherRole;
}

export default AuthPayload;
