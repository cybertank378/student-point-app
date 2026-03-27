//Files: src/modules/student/presentation/utils/transformStudentFilter.ts
import {StudentFilter} from "@/modules/student/domain/types/StudentFilter";
import {StudentFilterUI} from "@/modules/student/domain/types/StudentFilterUI";

export function transformStudentFilter(
	filters: StudentFilterUI
): StudentFilter {

	return {
		search: filters.search || undefined,
		classId: filters.classId || undefined,
		status: filters.status || undefined,
		isDifable:
			filters.isDifable === ""
				? undefined
				: filters.isDifable === "true"
	};

}