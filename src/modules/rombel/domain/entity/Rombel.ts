//Files: src/modules/rombel/domain/entity/Rombel.ts

/**
 * Domain Entity: Rombel (Rombongan Belajar)
 * Contoh: 7A, 8B, 9C
 */
export class Rombel {
    constructor(
        public readonly id: string,
        public readonly grade: String,          // 7 | 8 | 9
        public readonly name: string,           // A, B, C
        public readonly academicYearId: string, // FK AcademicYear
        public readonly createdAt: Date,

        public readonly studentCount: number,
    ) {}

    /**
     * Label rombel, contoh: "7A"
     */
    get label(): string {
        return `${this.grade}${this.name}`;
    }
}
