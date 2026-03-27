//Files: src/modules/student/application/provider/StudentChildFactory.ts

import {StudentAchievementService} from "@/modules/student-achievement/application/services/StudentAchievementServices";
import {
	StudentAchievementController
} from "@/modules/student-achievement/infrastructure/http/StudentAchievementController";
import {
	StudentAchievementRepository
} from "@/modules/student-achievement/infrastructure/repo/StudentAchievementRepository";
import {StudentAidService} from "@/modules/student-aid/application/services/StudentAidService";
import {StudentAidController} from "@/modules/student-aid/infrastructure/http/StudentAidController";
import {StudentAidRepository} from "@/modules/student-aid/infrastructure/repo/StudentAidRepository";
import type {
	StudentCompositeRepository
} from "@/modules/student-composite/infrastructure/repo/StudentCompositeRepository";
import {StudentCounselingService} from "@/modules/student-counseling/application/services/StudentCounselingService";
import {
	StudentCounselingController
} from "@/modules/student-counseling/infrastructure/http/StudentCounselingController";
import {
	StudentCounselingRepository
} from "@/modules/student-counseling/infrastructure/repo/StudentCounselingRepository";
import {StudentPointService} from "@/modules/student-point/application/services/StudentPointService";
import {StudentPointController} from "@/modules/student-point/infrastructure/http/StudentPointController";
import {StudentPointRepository} from "@/modules/student-point/infrastructure/repo/StudentPointRepository";
import {StudentProfileService} from "@/modules/student-profile/application/services/StudentProfileService";
import {StudentProfileController} from "@/modules/student-profile/infrastructure/http/StudentProfileController";
import {StudentProfileRepository} from "@/modules/student-profile/infrastructure/repo/StudentProfileRepository";
import {StudentReportService} from "@/modules/student-report/application/service/StudentReportService";
import {StudentReportController} from "@/modules/student-report/infrastructure/http/controller/StudentReportController";
import {StudentReportRepository} from "@/modules/student-report/infrastructure/repo/StudentReportRepository";
import {StudentViolationService} from "@/modules/student-violation/application/services/StudentViolationService";
import {StudentViolationController} from "@/modules/student-violation/infrastructure/http/StudentViolationController";
import {StudentViolationRepository} from "@/modules/student-violation/infrastructure/repo/StudentViolationRepository";
import { StudentFamilyInfoService }from "@/modules/student-family-info/application/services/StudentFamilyInfoService"
import { StudentFamilyInfoController }from "@/modules/student-family-info/infrastructure/http/StudentFamilyInfoController"
import { StudentFamilyInfoRepository } from "@/modules/student-family-info/infrastructure/repo/StudentFamilyInfoRepository"
import {LocalFileStorageService} from "@/modules/shared/http/interface/LocalFileStorageService";
import {
	UploadStudentDocumentController
} from "@/modules/student-family-info/infrastructure/http/UploadStudentDocumentController";
import {
	DeleteStudentDocumentController
} from "@/modules/student-family-info/infrastructure/http/DeleteStudentDocumentController";


/**
 * ============================================================
 * STUDENT CHILD FACTORY
 * ============================================================
 *
 * Factory untuk membangun controller dari
 * setiap child-module student.
 */

export class StudentChildFactory {
	static profile (compositeRepo: StudentCompositeRepository) {
		const repo = new StudentProfileRepository ();
		const service = new StudentProfileService (repo, compositeRepo);

		return new StudentProfileController (service);
	}

	static aid () {
		const repo = new StudentAidRepository ();
		const service = new StudentAidService (repo);

		return new StudentAidController (service);
	}

	static point () {
		const repo = new StudentPointRepository ();
		const violationRepo = new StudentViolationRepository ();
		const achievementRepo =new StudentAchievementRepository ();
		const service = new StudentPointService (repo, violationRepo, achievementRepo);

		return new StudentPointController (service);
	}

	static violation (compositeRepo: StudentCompositeRepository) {
		const repo = new StudentViolationRepository ();
		const service = new StudentViolationService (repo, compositeRepo);

		return new StudentViolationController (service);
	}

	static achievement (compositeRepo: StudentCompositeRepository) {
		const repo = new StudentAchievementRepository ();
		const service = new StudentAchievementService (repo, compositeRepo);

		return new StudentAchievementController (service);
	}

	static counseling (compositeRepo: StudentCompositeRepository) {
		const repo = new StudentCounselingRepository ();
		const service = new StudentCounselingService (repo, compositeRepo);

		return new StudentCounselingController (service);
	}

	static report () {
		const repo = new StudentReportRepository ();
		const service = new StudentReportService (repo);
		return new StudentReportController (service);
	}

	static familyInfo () {
		const repo = new StudentFamilyInfoRepository()
		const storage = new LocalFileStorageService()
		const service = new StudentFamilyInfoService(repo, storage)

		const crudController = new StudentFamilyInfoController(service)
		const uploadController = new UploadStudentDocumentController(service)
		const deleteController = new DeleteStudentDocumentController (service)

		return {
			crud: crudController,
			uploadDocument: uploadController,
			deleteDocument: deleteController
		}
	}
}
