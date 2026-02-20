//Files: src/modules/user/infrastructure/repo/LocalFileStorageService.ts

import fs from "fs/promises";
import path from "path";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";

export class LocalFileStorageService implements FileStorageInterface {
    async save(
        folder: string,
        fileName: string,
        file: File
    ): Promise<void> {

        const uploadDir = path.join(
            process.cwd(),
            "public",
            "assets",
            "upload",
            folder
        );

        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);

        const buffer = Buffer.from(
            await file.arrayBuffer()
        );

        await fs.writeFile(filePath, buffer);
    }

    async delete(
        folder: string,
        fileName: string
    ): Promise<void> {

        const filePath = path.join(
            process.cwd(),
            "public",
            "assets",
            "upload",
            folder,
            fileName
        );

        try {
            await fs.unlink(filePath);
        } catch {
            // ignore if not exists
        }
    }
}
