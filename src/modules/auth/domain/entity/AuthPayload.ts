//Files: src/modules/auth/domain/entity/AuthPayload.ts

import type { JWTPayload } from "jose";
import type { Role, TeacherRole } from "@/libs/utils/enums";

interface AuthPayload extends JWTPayload {
  sub: string;

  username: string;
  role: Role;
  teacherRole?: TeacherRole;
}

export default AuthPayload;
