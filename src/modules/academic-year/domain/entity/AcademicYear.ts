//Files: src/modules/academic-year/domain/entity/AcademicYear.ts

/**
 * Domain Entity: Academic Year
 * Tahun ajaran sekolah
 */
export class AcademicYear {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
    ) {}

    /**
     * Domain helper
     */
    get isInactive(): boolean {
        return !this.isActive;
    }
}
