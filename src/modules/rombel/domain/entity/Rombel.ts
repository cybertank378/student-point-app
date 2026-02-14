//Files: src/modules/rombel/domain/entity/Rombel.ts

/**
 * Domain Entity: Rombel (Rombongan Belajar)
 * Contoh: 7A, 8B, 9C
 */
export class Rombel {
    constructor(
        public readonly id: string,
        public readonly grade: string,
        public readonly name: string,

        public readonly academicYearName: string, // 🔥 GANTI INI

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
