//Files: src/modules/violation/domain/entity/Violation.ts

import { ViolationLevel } from "@/generated/prisma";

/**
 * Domain Entity: Violation (MASTER)
 * Representasi pelanggaran sekolah
 */
export class Violation {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly point: number,
        public readonly level: ViolationLevel,
        public readonly createdAt: Date,
        public readonly deletedAt: Date | null,
    ) {}

    get isActive(): boolean {
        return this.deletedAt === null;
    }
}
