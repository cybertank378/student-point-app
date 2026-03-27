//Files: src/modules/student/presentation/utils/mapStudentFacilityForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentFacilityForm(
	facility: StudentCompositeDTO["facility"]
) {
	if (!facility) return null;

	return {
		hasPC: facility.hasPC,
		hasLaptop: facility.hasLaptop,
		hasPhone: facility.hasPhone,
		internetAccess: facility.internetAccess,
	};
}