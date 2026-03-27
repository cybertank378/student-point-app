//Files: src/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface.ts

import {CreateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO";
import {StudentFamilyInfo} from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";
import {UpdateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO";
import {DeleteStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/DeleteStudentFamilyInfoDTO";

export interface StudentFamilyInfoInterface {

	create(
		data: CreateStudentFamilyInfoDTO
	): Promise<StudentFamilyInfo>;

	update(
		data: UpdateStudentFamilyInfoDTO
	): Promise<StudentFamilyInfo>;

	delete(
		payload: DeleteStudentFamilyInfoDTO
	): Promise<void>;

	findByStudentId(
		studentId: string
	): Promise<StudentFamilyInfo | null>;


	addDocument(studentId: string, filePath: string): Promise<void>;
	removeDocument(studentId: string, filePath: string): Promise<void>;
	getDocuments(studentId: string): Promise<string[]>;

}