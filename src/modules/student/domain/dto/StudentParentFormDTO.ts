//Files: src/modules/student/domain/types/StudentParentFormDTO.ts

import type { EducationLevel, ParentType } from "@/libs/utils/enums";

export interface StudentParentFormDTO {
	role: ParentType;

	parent: {
		id: string;
		name: string;
		email: string | null;
		phone: string;
		education: EducationLevel;
		job: string;
		income: string | null;
		religionCode: string;
		address: string;
		guardianRelation: string | null;
	};
}

