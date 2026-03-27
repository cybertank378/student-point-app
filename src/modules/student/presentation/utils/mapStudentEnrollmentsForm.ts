// Files: src/modules/student/presentation/utils/mapStudentEnrollmentForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {EnrollmentStatus} from "@/libs/utils/enums";

export function mapStudentEnrollmentForm(
	enrollments: StudentCompositeDTO["enrollments"]
) {
	return enrollments.map((e) => ({
		academicYearId: e.academicYearId,
		academicYear: {
			name: e.academicYear.name,
		},
		classId: e.classId,
		class: {
			name: e.class.name,
			grade: e.class.grade,
		},
		status: e.status as EnrollmentStatus,
	}));
}