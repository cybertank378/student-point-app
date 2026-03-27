//Files: src/modules/student/presentation/utils/mapStudentReligionActivityForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentReligionActivityForm(
	religionActivity: StudentCompositeDTO["religionActivity"]
) {
	if (!religionActivity) return null;

	return {
		prayFiveTimes: religionActivity.prayFiveTimes,
		oftenMissPrayer: religionActivity.oftenMissPrayer,
		quranStudyLevel: religionActivity.quranStudyLevel,
		worshipActivities: religionActivity.worshipActivities,
		worshipLocation: religionActivity.worshipLocation,
	};
}