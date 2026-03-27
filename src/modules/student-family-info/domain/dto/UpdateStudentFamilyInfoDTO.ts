//Files: src/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO.ts

import { CreateStudentFamilyInfoDTO } from "./CreateStudentFamilyInfoDTO";

export type UpdateStudentFamilyInfoDTO =
	Partial<Omit<CreateStudentFamilyInfoDTO, "studentId">> & {
	studentId: string
};