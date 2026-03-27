//Files: src/modules/student-family-info/domain/builder/BuildCreateStudentFamilyInfo.ts

import {CreateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO";
import {StudentFamilyInfo} from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";

export function BuildCreateStudentFamilyInfo(
	dto: CreateStudentFamilyInfoDTO
): StudentFamilyInfo {

	return {
		studentId: dto.studentId,
		livingWith: dto.livingWith,
		houseOwnership: dto.houseOwnership,
		headOfFamilyName: dto.headOfFamilyName,
		familyCardAddress: dto.familyCardAddress,
		documents: dto.documents ?? null,

	};

}