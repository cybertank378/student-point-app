//Files: src/modules/rombel/domain/entity/Rombel.ts

/**
 * Domain Entity: Rombel (Rombongan Belajar)
 * Contoh: VII-1, VIII-2, IX-3
 */
export class Rombel {

    constructor(
        public readonly id: string,

        public readonly grade: string,

        public readonly name: string,

        public readonly academicYearId: string,
        public readonly academicYearName: string,

        public readonly homeroomTeacherId: string | null,

        public readonly createdAt: Date,

        public readonly studentCount: number
    ) {}

    /**
     * Label rombel
     * Contoh: VII-1
     */
    get label(): string {
        return `${this.grade}-${this.name}`;
    }

}