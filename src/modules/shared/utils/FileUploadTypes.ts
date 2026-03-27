//Files: src/modules/shared/utils/FileUploadTypes.ts
export type UploadResult = {
	data: { fileUrl: string } | null;
	error: { message: string } | null;
};

export type DeleteResult = {
	success: boolean;
	error?: { message: string } | null;
};