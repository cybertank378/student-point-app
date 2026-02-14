//Files: src/modules/rombel/domain/dto/CreateRombelDTO.ts

/**
 * Payload create rombel
 */
export interface CreateRombelDTO {
    grade: string;          // 7 | 8 | 9
    name: string;           // A, B, C
    academicYearId: string; // FK
}