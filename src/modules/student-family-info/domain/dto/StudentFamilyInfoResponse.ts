// Files: src/modules/student-family-info/domain/dto/StudentFamilyInfoResponse.ts

export interface StudentFamilyInfoResponse {
	studentId: string;
	livingWith: string | null;
	houseOwnership: string | null;
	headOfFamilyName: string | null;
	familyCardAddress: string | null;
	documents: string[];
}