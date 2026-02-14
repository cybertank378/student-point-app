//Files: src/modules/auth/application/service/BcryptService.ts

import {
    hashPassword,
    comparePassword,
} from '@/modules/shared/core/bcrypt';
import type {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";


export class BcryptService implements HashServiceInterface
{
    async hash(value: string): Promise<string> {
        return hashPassword(value);
    }

    async compare(
        value: string,
        hash: string,
    ): Promise<boolean> {
        return comparePassword(value, hash);
    }
}
