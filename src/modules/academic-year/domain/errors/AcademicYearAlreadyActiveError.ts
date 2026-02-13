//Files: src/modules/academic-year/domain/errors/AcademicYearAlreadyActiveError.ts

export class AcademicYearAlreadyActiveError extends Error {
    constructor() {
        super("Hanya satu tahun ajaran yang boleh aktif.");
        this.name = "AcademicYearAlreadyActiveError";
    }
}
