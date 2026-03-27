//Files: src/modules/student/domain/types/StudentFormType.ts

import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

export type StudentFormType = Omit<
	StudentCompositeDTO,
	| "createdAt"
	| "achievements"
	| "attendances"
	| "violations"
	| "counselingCases"
	| "point"
> & {
	id: string;
};