//Files: src/modules/student-family-info/domain/dto/StudentFamilyInfoRespDTO.ts
import { HouseOwnership } from "@/generated/prisma";

export interface StudentFamilyInfoRespDTO {

	id: string

	studentId: string;

	livingWith: string | null;

	houseOwnership: HouseOwnership | null;

	headOfFamilyName: string;

	familyCardAddress: string;

	documents?: string[] | null;

}