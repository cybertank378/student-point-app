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

export class AcademicYearHttpMapper {
    static toDomain(
        item: AcademicYearResponse,
    ): AcademicYear {
        return new AcademicYear(
            item.id,
            item.name,
            item.startDate,
            item.endDate,
            item.isActive,
            new Date(item.createdAt),
        );
    }

    static toDomainList(
        items: AcademicYearResponse[],
    ): AcademicYear[] {
        return items.map((item) =>
            AcademicYearHttpMapper.toDomain(item),
        );
    }
}
