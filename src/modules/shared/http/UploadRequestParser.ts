//Files: src/modules/shared/http/UploadRequestParser.ts

export interface ParsedUploadRequest {
	file: File;
	fields: Record<string, string>;
}

export async function parseUploadRequest(
	req: Request
): Promise<ParsedUploadRequest> {

	const formData = await req.formData();

	const file = formData.get("file") as File | null;

	if (!file) {
		throw new Error("File tidak ditemukan.");
	}

	const fields: Record<string, string> = {};

	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			fields[key] = value;
		}
	}

	return { file, fields };
}