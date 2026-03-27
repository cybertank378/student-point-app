//Files: src/modules/student/domain/types/StudentFilter.ts

import {EnrollmentStatus} from "@/libs/utils/enums";

export interface StudentFilter {
	search?: string;
	classId?: string;
	isDifable?: boolean;
	status?: EnrollmentStatus;
}