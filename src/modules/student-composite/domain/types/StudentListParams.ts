//Files: src/modules/student-composite/domain/types/StudentListParams.ts

import {EnrollmentStatus} from "@/libs/utils/enums";

export interface StudentListParams {

	page?: number
	limit?: number

	search?: string

	classId?: string

	isDifable?: boolean

	status?: EnrollmentStatus
}