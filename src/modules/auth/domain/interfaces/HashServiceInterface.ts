//Files: src/modules/auth/domain/interfaces/HashServiceInterface.ts

export interface HashServiceInterface {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}