// Files: src/modules/student/presentation/utils/mapStudentAidsForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export function mapStudentAidsForm(
	aids: StudentCompositeDTO["aids"]
) {
	return aids.map((a) => ({
		academicYearId: a.academicYearId,
		academicYear: {
			name: a.academicYear.name,
		},
		kjp: a.kjp,
		pip: a.pip,
	}));
}