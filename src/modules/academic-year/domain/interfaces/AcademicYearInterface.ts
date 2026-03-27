//Files: src/modules/academic-year/domain/interfaces/AcademicYearInterface.ts
//Files: src/modules/academic-year/domain/interfaces/AcademicYearInterface.ts

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";

export interface AcademicYearInterface {
  findAll(): Promise<AcademicYear[]>;

  findById(id: string): Promise<AcademicYear | null>;

  findActive(): Promise<AcademicYear | null>;

  findOverlapping(startDate: Date, endDate: Date): Promise<boolean>;

  create(dto: CreateAcademicYearDTO): Promise<AcademicYear>;

  update(dto: UpdateAcademicYearDTO): Promise<AcademicYear>;

  setActive(id: string): Promise<void>;

  deactivateAll(): Promise<void>;

  delete(id: string): Promise<void>;
}