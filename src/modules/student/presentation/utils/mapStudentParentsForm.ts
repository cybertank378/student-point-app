//Files: src/modules/student/presentation/utils/mapStudentParentsForm.ts

import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {StudentParentFormDTO} from "@/modules/student/domain/dto/StudentParentFormDTO";
import {EducationLevel} from "@/libs/utils/enums";

export function mapStudentParentsForm(
	parents: StudentCompositeDTO["parents"]
): StudentParentFormDTO[] {
	return parents.map((p) => ({
		role: p.role,
		parent: {
			id: p.parent.id,
			name: p.parent.name,
			email: p.parent.email,
			phone: p.parent.phone,
			education: p.parent.education as EducationLevel,
			job: p.parent.job,
			income: p.parent.income,
			religionCode: p.parent.religionCode,
			address: p.parent.address,
			guardianRelation: p.parent.guardianRelation,
		},
	})
	);
}