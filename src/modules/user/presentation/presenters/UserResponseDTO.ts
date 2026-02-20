//Files: src/modules/user/presentation/presenters/UserResponseDTO.ts

export interface UserResponseDTO {
    id: string;
    username: string;
    image: string | null;
    role: string;
    teacherRole: string | null;
    isActive: boolean;

    student?: {
        id: string;
        name: string;
        nis: number;
        nisn: number;
    } | null;

    parent?: {
        id: string;
        name: string;
        phone: string;
    } | null;

    teacher?: {
        id: string;
        name: string;
        nip: string;
        nrp: string;
        nuptk: string;
        nrk: string;
        nrg: number;
    } | null;

    createdAt: Date;
    updatedAt: Date;
}
