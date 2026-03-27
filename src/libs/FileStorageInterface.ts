// Files: src/libs/FileStorageInterface.ts

export interface StoredFileResult {
  fileName: string;
  filePath: string;
  publicUrl: string;
}

export interface FileStorageInterface {
  save(
      folder: string,
      fileName: string,
      file: File
  ): Promise<StoredFileResult>;

  delete(
      folder: string,
      fileName: string
  ): Promise<void>;

  replace(
      folder: string,
      fileName: string,
      file: File
  ): Promise<StoredFileResult>;
}