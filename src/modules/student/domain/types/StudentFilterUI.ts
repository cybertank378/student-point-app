//Files: src/modules/student/domain/types/StudentFilterUI.ts
import { EnrollmentStatus } from "@/libs/utils/enums";

export interface StudentFilterUI {
	search: string;
	classId: string;
	isDifable: "" | "true" | "false";
	status: "" | EnrollmentStatus;
}