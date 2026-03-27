//Files: src/modules/student/presentation/utils/mapStudentCoreForm.ts
import { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {FamilyStatus, Gender} from "@/libs/utils/enums";

export function mapStudentCoreForm(student?: StudentCompositeDTO | null) {
	return {
		id: student?.id ?? "",
		nis: student?.nis ?? null,
		nisn: student?.nisn ?? "",
		name: student?.name ?? "",
		nickname: student?.nickname ?? null,
		gender: student?.gender ?? Gender.MALE,
		photo: student?.photo ?? null,
		birthPlace: student?.birthPlace ?? "",
		birthDate: student?.birthDate
			? new Date(student.birthDate)
			: new Date(),
		address: student?.address ?? "",
		phone: student?.phone ?? null,
		email: student?.email ?? null,
		religionCode: student?.religionCode ?? "",
		nik: student?.nik ?? null,
		kkNumber: student?.kkNumber ?? null,
		schoolOrigin: student?.schoolOrigin ?? null,
		graduationScore: student?.graduationScore ?? null,
		instagram: student?.instagram ?? null,
		familyStatus: student?.familyStatus ?? FamilyStatus.COMPLETE,
		isDifable: student?.isDifable ?? false,
		difableNotes: student?.difableNotes ?? null,
	};
}