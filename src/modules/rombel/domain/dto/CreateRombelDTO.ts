//Files: src/modules/rombel/domain/dto/CreateRombelDTO.ts

/**
 * Payload create rombel
 */
export interface CreateRombelDTO {
    grade: string;
    name: string;
    academicYearId: string;
    homeroomTeacherId?: string | null;
}