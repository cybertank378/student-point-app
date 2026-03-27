//Files: src/modules/student-family-info/domain/dto/UploadStudentDocumentRequest.ts
export type UploadStudentDocumentRequest = {
	studentId: string;
	file: File;
	nisn: string;
	academicYear: string;
};