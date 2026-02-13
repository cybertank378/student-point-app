//Files: src/modules/user/domain/mapper/UserMapper.ts

import { User as PrismaUser } from "@/generated/prisma";
import {User} from "@/modules/user/domain/entity/User";

export class UserMapper {
    static toDomain(data: PrismaUser): User {
        return new User(
            data.id,
            data.username,
            data.password,
            data.role,
            data.isActive,
            data.failedAttempts,
            data.lockUntil,
            data.mustChangePassword,
            data.createdAt,
            data.updatedAt,
        );
    }
}
