//Files: src/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO.ts

import { HouseOwnership } from "@/libs/utils/enums";

export interface CreateStudentFamilyInfoDTO {
	studentId: string;

	livingWith: string;

	houseOwnership: HouseOwnership | null;

	headOfFamilyName: string;

	familyCardAddress: string;

	documents?: string[] | null;

}