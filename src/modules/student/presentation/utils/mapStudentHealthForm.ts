// Files: src/modules/student/presentation/utils/mapStudentHealthForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentHealthForm(
	health: StudentCompositeDTO["health"]
) {
	if (!health) return null;

	return {
		inclusion: health.inclusion,
		canRead: health.canRead,
		canWrite: health.canWrite,
		canCount: health.canCount,
		canSpeak: health.canSpeak,
		canFollowCeremony: health.canFollowCeremony,
		canDoSport: health.canDoSport,
		canSeeBoard: health.canSeeBoard,
		canHearClearly: health.canHearClearly,
		canWalkRun: health.canWalkRun,
		canHoldPen: health.canHoldPen,
		dominantHandRight: health.dominantHandRight,
		diseaseHistory: health.diseaseHistory,
		hasPsychologistLetter: health.hasPsychologistLetter,
		hasIQTest: health.hasIQTest,
		iqScore: health.iqScore,
	};
}