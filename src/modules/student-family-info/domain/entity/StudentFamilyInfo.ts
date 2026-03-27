//Files: src/modules/student-family-info/domain/entity/StudentFamilyInfo.ts

import { HouseOwnership } from "@/libs/utils/enums";

export interface StudentFamilyInfo {

	readonly studentId: string;

	readonly livingWith: string;

	readonly houseOwnership: HouseOwnership | null;

	readonly headOfFamilyName: string;

	readonly familyCardAddress: string;

	readonly documents: string[] | null;


}