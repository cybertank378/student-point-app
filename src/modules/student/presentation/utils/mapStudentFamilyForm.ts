// Files: src/modules/student/presentation/utils/mapStudentFamilyForm.ts
import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentFamilyForm(
	family: StudentCompositeDTO["family"]
) {
	return {
		livingWith: family?.livingWith ?? "",
		houseOwnership: family?.houseOwnership ?? null,
		headOfFamilyName: family?.headOfFamilyName ?? "",
		familyCardAddress: family?.familyCardAddress ?? "",
		documents: family?.documents ?? []
	};
}