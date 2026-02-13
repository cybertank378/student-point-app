//Files: src/modules/achievement/domain/entity/ListAchievementUseCase.ts

/**
 * Domain Entity: Achievement (MASTER)
 * Tidak tahu Prisma / HTTP
 */
export class Achievement {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly point: number,
        public readonly createdAt: Date,
        public readonly deletedAt: Date | null,
    ) {}

    /**
     * Domain helper
     */
    get isActive(): boolean {
        return this.deletedAt === null;
    }
}
