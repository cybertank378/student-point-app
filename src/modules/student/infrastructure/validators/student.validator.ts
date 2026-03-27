//Files: src/modules/student/infrastructure/validators/student.validator.ts
import {z} from "zod";
import {EducationLevel, EnrollmentStatus, HouseOwnership, ParentType} from "@/libs/utils/enums";
import {
	BaseIdSchema,
	BaseNisnSchema,
	BaseStudentSchema
} from "@/modules/student/infrastructure/validators/base.student.validator";
import {UUID_REGEX} from "@/libs/utils";
import {TeacherObjectSchema, teacherRefinement} from "@/modules/teacher/infrastructure/validators/base.validator";


export const studentIdSchema = z.object ({
	id: BaseIdSchema,
});

export const studentNisnSchema = z.string ().max (10);


export const createStudentSchema = BaseStudentSchema.omit ({
	photo: true,
}).extend ({
	photo: z.string ().nullable ().optional (),
	familyStatus: BaseStudentSchema.shape.familyStatus.optional (),
	isDifable: BaseStudentSchema.shape.isDifable.optional (),
	difableNotes: BaseStudentSchema.shape.difableNotes.optional (),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
	nisn: BaseNisnSchema.optional().nullable(),
});

export const importStudentSchema = z.array (
	z.object ({
		/* =========================================================
		 CORE STUDENT
		 ========================================================= */

		student: BaseStudentSchema.omit ({
			photo: true,
		}),

		/* =========================================================
		 STUDENT PROFILE
		 ========================================================= */

		profile: z
			.object ({
				childOrder: z.number ().optional (),
				totalSiblings: z.number ().optional (),
				distanceToSchool: z.string ().optional (),
				transport: z.string ().optional (),
				hobby: z.string ().optional (),
				dream: z.string ().optional (),
				closeFriend: z.string ().optional (),
			})
			.optional (),

		/* =========================================================
		 STUDENT FACILITY
		 ========================================================= */

		facility: z.object ({
			hasPC: z.boolean ().optional (),
			hasLaptop: z.boolean ().optional (),
			hasPhone: z.boolean ().optional (),
			internetAccess: z.string ().optional (),
		}),

		/* =========================================================
		 STUDENT HEALTH
		 ========================================================= */

		health: z
			.object ({
				inclusion: z.boolean ().optional (),
				canRead: z.boolean ().optional (),
				canWrite: z.boolean ().optional (),
				canCount: z.boolean ().optional (),
				canSpeak: z.boolean ().optional (),
				canFollowCeremony: z.boolean ().optional (),
				canDoSport: z.boolean ().optional (),
				canSeeBoard: z.boolean ().optional (),
				canHearClearly: z.boolean ().optional (),
				canWalkRun: z.boolean ().optional (),
				canHoldPen: z.boolean ().optional (),
				dominantHandRight: z.boolean ().optional (),
				diseaseHistory: z.string ().optional (),
			})
			.optional (),

		/* =========================================================
		 RELIGION ACTIVITY
		 ========================================================= */

		religionActivity: z
			.object ({
				prayFiveTimes: z.boolean ().optional (),
				oftenMissPrayer: z.string ().optional (),
				quranStudyLevel: z.string ().optional (),
				worshipActivities: z.string ().optional (),
				worshipLocation: z.string ().optional (),
			})
			.optional (),

		/* =========================================================
		 FAMILY INFORMATION
		 ========================================================= */

		family: z
			.object ({
				livingWith: z.string ().optional (),
				houseOwnership: z.enum (HouseOwnership).optional (),
				headOfFamilyName: z.string ().optional (),
				familyCardAddress: z.string ().optional (),
			})
			.optional (),

		/* =========================================================
		 PARENTS
		 ========================================================= */

		parents: z
			.array (
				z.object ({
					role: z.enum (ParentType),
					name: z.string (),
					phone: z.string (),
					education: z.enum (EducationLevel),
					job: z.string (),
					income: z.string ().optional (),
					religionCode: z.string (),
  					address: z.string (),
					guardianRelation: z.string ().optional (),
				})
			)
			.optional (),

		/* =========================================================
		 ENROLLMENT
		 ========================================================= */

		enrollment: z
			.object ({
				academicYearId: z.string (),
				academicYear: ({
					academicYearName: z.string ().optional (),
				}),
				classId: z.string (),
				class: z.object ({
					grade: z.string ().optional (),
					name: z.string ().optional (),
				}),
				status: z.enum (EnrollmentStatus).optional (),
			})
			.optional (),

		/* =========================================================
		 STUDENT AID
		 ========================================================= */
		aids: z
			.array (
				z.object ({
					academicYearId: z.string (),
					kjp: z.boolean ().optional (),
					pip: z.boolean ().optional (),
				})
			)
			.optional (),
	})
);

export const deleteStudentSchema = z.object ({
	id: BaseIdSchema,
});


export const ListStudentSchema = z.object({
	page: z.coerce.number().optional(),
	limit: z.coerce.number().optional(),

	search: z.string().optional(),

	classId: z.string().uuid().optional(),

	isDifable: z
		.string()
		.optional()
		.transform((val) =>
			val === undefined ? undefined : val === "true"
		),

	status: z.enum(EnrollmentStatus).optional(),
});
