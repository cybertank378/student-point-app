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
        nis: string | null;
        nisn: string;
        parents: {
            id: string;
            name: string;
            phone: string;
            role: string;
        }[];
    } | null;

    parent?: {
        id: string;
        name: string;
        phone: string | null;
        students: {
            id: string;
            name: string;
            nis: string | null;
            nisn: string;
            role: string;
        }[];
    } | null;

    teacher?: {
        id: string;
        name: string;
        nip: string | null;     // BigInt → string
        nuptk: string | null;
        nrk: string | null;
        nrg: string;            // NOT NULL
    } | null;

    createdAt: Date;
    updatedAt: Date;
}