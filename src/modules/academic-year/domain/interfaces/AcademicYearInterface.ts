//Files: src/modules/academic-year/domain/interfaces/AcademicYearInterface.ts

import {AcademicYear} from "@/modules/academic-year/domain/entity/AcademicYear";
import {CreateAcademicYearDTO} from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import {UpdateAcademicYearDTO} from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";

/**
 * Port / Contract AcademicYear
 */
export interface AcademicYearInterface {
    findAll(): Promise<AcademicYear[]>;
    findById(id: string): Promise<AcademicYear | null>;
    findActive(): Promise<AcademicYear | null>;

    create(dto: CreateAcademicYearDTO): Promise<AcademicYear>;
    update(dto: UpdateAcademicYearDTO): Promise<AcademicYear>;

    setActive(id: string): Promise<void>;
    deactivateAll(): Promise<void>;

    delete(id: string): Promise<void>;
}