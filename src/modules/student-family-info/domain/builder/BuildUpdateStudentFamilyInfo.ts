//Files: src/modules/student-family-info/domain/builder/BuildUpdateStudentFamilyInfo.ts
import {StudentFamilyInfo} from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";
import {UpdateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO";

export function BuildUpdateStudentFamilyInfo(
	existing: StudentFamilyInfo,
	dto: UpdateStudentFamilyInfoDTO
): StudentFamilyInfo {
	return {
		...existing,

		livingWith: dto.livingWith ?? existing.livingWith,
		houseOwnership: dto.houseOwnership ?? existing.houseOwnership,
		headOfFamilyName: dto.headOfFamilyName ?? existing.headOfFamilyName,
		familyCardAddress: dto.familyCardAddress ?? existing.familyCardAddress,

		// ❗ JANGAN ambil dari dto
		documents: existing.documents,
	};
}