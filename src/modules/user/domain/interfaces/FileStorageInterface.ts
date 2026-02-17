// Files : src/modules/user/domain/interfaces/FileStorageInterface.ts

export interface FileStorageInterface {
    save(
        folder: string,
        fileName: string,
        file: File
    ): Promise<void>;

    delete(
        folder: string,
        fileName: string
    ): Promise<void>;
}
