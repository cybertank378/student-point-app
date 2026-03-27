//Files: src/modules/student-family-info/domain/dto/UploadStudentFamilyDocumentDTO.ts

export interface UploadStudentFamilyDocumentDTO {
	studentId: string;
	nisn: string;
	academicYear: string;
	file: File;
}