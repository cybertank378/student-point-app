//Files: src/modules/student/presentation/utils/createEmptyStudentForm.ts
import {StudentFormType} from "@/modules/student/domain/types/StudentFormType";

import {mapStudentParentsForm} from "@/modules/student/presentation/utils/mapStudentParentsForm";
import {mapStudentAidsForm} from "@/modules/student/presentation/utils/mapStudentAidsForm";
import {mapStudentFamilyForm} from "@/modules/student/presentation/utils/mapStudentFamilyForm";
import {mapStudentCoreForm} from "@/modules/student/presentation/utils/mapStudentCoreForm";
import {mapStudentProfileForm} from "@/modules/student/presentation/utils/mapStudentProfileForm";
import {mapStudentFacilityForm} from "@/modules/student/presentation/utils/mapStudentFacilityForm";
import {mapStudentEnrollmentForm} from "@/modules/student/presentation/utils/mapStudentEnrollmentsForm";
import {mapStudentHealthForm} from "@/modules/student/presentation/utils/mapStudentHealthForm";
import {mapStudentReligionActivityForm} from "@/modules/student/presentation/utils/mapStudentReligionActivityForm";


export function createEmptyStudentForm(): StudentFormType {
	return {
		...mapStudentCoreForm(null),
		family: mapStudentFamilyForm(null),
		parents: mapStudentParentsForm([]),
		profile: mapStudentProfileForm(null),
		facility: mapStudentFacilityForm(null),
		health: mapStudentHealthForm(null),
		religionActivity: mapStudentReligionActivityForm(null),
		enrollments: mapStudentEnrollmentForm([]),
		aids: mapStudentAidsForm([])
	}
}