//Files: src/modules/academic-year/domain/dto/UpdateAcademicYearDTO.ts


/**
 * Payload untuk update Academic Year
 */
export interface UpdateAcademicYearDTO {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean,

}
