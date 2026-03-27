//Files: src/libs/BuildLocalFileViewer.ts

export function BuildLocalFileViewer(
	folder: string,
	fileName: string
) {
	return `/assets/upload/${folder}/${fileName}`;
}