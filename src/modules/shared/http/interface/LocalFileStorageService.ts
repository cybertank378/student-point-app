import fs from "fs/promises";
import path from "path";

import type {
  FileStorageInterface,
  StoredFileResult
} from "@/libs/FileStorageInterface";

export class LocalFileStorageService implements FileStorageInterface {

  private readonly basePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "upload"
  );

  private normalizeFolder(folder: string): string {
    return folder.replace(/^\/+|\/+$/g, "");
  }

  private resolveFolderPath(folder: string): string {
    return path.join(this.basePath, this.normalizeFolder(folder));
  }

  private resolveFilePath(folder: string, fileName: string): string {
    return path.join(this.resolveFolderPath(folder), fileName);
  }

  private buildPublicUrl(folder: string, fileName: string): string {
    const normalizedFolder = this.normalizeFolder(folder);
    return `/assets/upload/${normalizedFolder}/${fileName}`.replace(/\\/g, "/");
  }

  async save(
      folder: string,
      fileName: string,
      file: File
  ): Promise<StoredFileResult> {

    const folderPath = this.resolveFolderPath(folder);
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = this.resolveFilePath(folder, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return {
      fileName,
      filePath,
      publicUrl: this.buildPublicUrl(folder, fileName)
    };
  }

  async delete(folder: string, fileName: string): Promise<void> {
    const filePath = this.resolveFilePath(folder, fileName);
    try {
      await fs.unlink(filePath);
    } catch {}
  }

  async replace(
      folder: string,
      fileName: string,
      file: File
  ): Promise<StoredFileResult> {
    await this.delete(folder, fileName);
    return this.save(folder, fileName, file);
  }
}