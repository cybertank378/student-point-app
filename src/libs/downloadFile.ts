//Files: src/libs/downloadFile.ts

export async function downloadFileFromResponse(
    res: Response,
    fileName: string
) {
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
}