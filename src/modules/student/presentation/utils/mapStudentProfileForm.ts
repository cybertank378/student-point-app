//Files: src/modules/student/presentation/utils/mapStudentProfileForm.ts

// Files: src/modules/student/presentation/utils/mapStudentProfileForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentProfileForm(
	profile: StudentCompositeDTO["profile"]
) {
	if (!profile) return null;

	return {
		childOrder: profile.childOrder,
		totalSiblings: profile.totalSiblings,
		distanceToSchool: profile.distanceToSchool,
		transport: profile.transport,
		hobby: profile.hobby,
		dream: profile.dream,
		closeFriend: profile.closeFriend,
	};
}