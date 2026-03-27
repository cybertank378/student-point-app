//Files: src/modules/student/presentation/utils/mapStudentToForm.ts

import type { StudentFormType } from "@/modules/student/domain/types/StudentFormType";
import {StudentCompositeDTO} from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {mapStudentParentsForm} from "@/modules/student/presentation/utils/mapStudentParentsForm";
import {mapStudentAidsForm} from "@/modules/student/presentation/utils/mapStudentAidsForm";
import {mapStudentFamilyForm} from "@/modules/student/presentation/utils/mapStudentFamilyForm";
import {mapStudentCoreForm} from "@/modules/student/presentation/utils/mapStudentCoreForm";
import {mapStudentProfileForm} from "@/modules/student/presentation/utils/mapStudentProfileForm";
import {mapStudentFacilityForm} from "@/modules/student/presentation/utils/mapStudentFacilityForm";
import {mapStudentEnrollmentForm} from "@/modules/student/presentation/utils/mapStudentEnrollmentsForm";
import {mapStudentHealthForm} from "@/modules/student/presentation/utils/mapStudentHealthForm";
import {mapStudentReligionActivityForm} from "@/modules/student/presentation/utils/mapStudentReligionActivityForm";

export function mapStudentToForm(
	student: StudentCompositeDTO
): StudentFormType {
	return {
		...mapStudentCoreForm(student),
		parents: mapStudentParentsForm(student.parents),
		aids: mapStudentAidsForm(student.aids),
		religionActivity: mapStudentReligionActivityForm(student.religionActivity),
		health: mapStudentHealthForm(student.health),
		profile: mapStudentProfileForm(student.profile),
		family: mapStudentFamilyForm(student.family),
		enrollments: mapStudentEnrollmentForm(student.enrollments),
		facility: mapStudentFacilityForm(student.facility),

	};
}