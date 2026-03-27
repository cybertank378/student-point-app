//Files: src/modules/academic-year/presentation/mapper/AcademicYearHttpMapper.ts
import { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

export interface AcademicYearResponse {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: string;
}

/**
 * HTTP → Domain Mapper
 */

export function toAcademicYearDomain(item: AcademicYearResponse): AcademicYear {
  return new AcademicYear(
    item.id,
    item.name,
    item.startDate,
    item.endDate,
    item.isActive,
    new Date(item.createdAt),
  );
}

export function toAcademicYearDomainList(
  items: AcademicYearResponse[],
): AcademicYear[] {
  return items.map(toAcademicYearDomain);
}
