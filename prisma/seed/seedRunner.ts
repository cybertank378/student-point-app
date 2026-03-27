//Files: prisma/seedRunner.ts

import type { Seeder } from "./types";

/* MASTER */

import academicYearSeeder from "./master/academicYear.seed";
import achievementSeeder from "./master/achievement.seed";
import religionSeeder from "./master/religion.seed";
import violationSeeder from "./master/violation.seed";

/* TEACHER */

import teacherSeeder from "./teacher/teacher.seed";

/* CLASS */

import classSeeder from "./master/class.seed";

/* STUDENT */

import studentSeeder from "./student/student.seed";

/* FAMILY */

import parentSeeder from "./parent/parent.seed";
import studentParentSeeder from "./parent/studentParent.seed";

/* STUDENT DETAIL */

import studentEnrollmentSeeder from "./student/studentEnrollment.seed";
import studentFacilitySeeder from "./student/studentFacility.seed";
import studentFamilySeeder from "./student/studentFamily.seed";
import studentHealthSeeder from "./student/studentHealth.seed";
import studentProfileSeeder from "./student/studentProfile.seed";
import studentReligionSeeder from "./student/studentReligion.seed";

/* STUDENT ACTIVITY */

import studentAchievementSeeder from "./student/studentAchievement.seed";
import studentAttendanceSeeder from "./student/studentAttendance.seed";
import studentPointRecalculateSeeder from "./student/studentPointRecalculate.seed";
import studentViolationSeeder from "./student/studentViolation.seed";

/* DISCIPLINE */

import disciplineThresholdSeeder from "./discipline/disciplineThreshold.seed";
import violationResolutionSeeder from "./discipline/violationResolution.seed";

/* COUNSELING */

import counselingCaseSeeder from "./counseling/counselingCase.seed";

/* AUTH */

import adminUserSeeder from "./auth/admin.seed";

/* SUMMARY */

import pointSummarySeeder from "./summary/pointSummary.seed";

/* AUDIT */

import systemAuditLogSeeder from "./audit/systemAuditLog.seed";

/* PIPELINE */

const pipeline: Seeder[] = [
  /* MASTER */

  religionSeeder,
  academicYearSeeder,
  achievementSeeder,
  violationSeeder,

  /* CORE */

  teacherSeeder,
  classSeeder,

  /* STUDENT */

  studentSeeder,

  /* FAMILY */

  parentSeeder,
  studentParentSeeder,

  /* STUDENT DETAIL */

  studentProfileSeeder,
  studentFacilitySeeder,
  studentFamilySeeder,
  studentReligionSeeder,
  studentHealthSeeder,

  /* ENROLLMENT */

  studentEnrollmentSeeder,

  /* STUDENT ACTIVITY */

  studentViolationSeeder,
  studentAttendanceSeeder,
  studentAchievementSeeder,
  studentPointRecalculateSeeder,

  /* DISCIPLINE */

  disciplineThresholdSeeder,
  violationResolutionSeeder,

  /* COUNSELING */

  counselingCaseSeeder,

  /* SYSTEM */

  adminUserSeeder,

  /* DERIVED */

  pointSummarySeeder,

  /* AUDIT */

  systemAuditLogSeeder,
];

/* RUNNER */

export async function runSeeders(): Promise<void> {
  const startedAt = Date.now();

  console.info("\nDATABASE_SEEDING_STARTED\n");

  for (const seeder of pipeline) {
    const start = Date.now();

    console.info(`Running: ${seeder.name}`);

    await seeder.execute();

    const duration = Date.now() - start;

    console.info(`Completed: ${seeder.name} (${duration}ms)\n`);
  }

  const duration = Date.now() - startedAt;

  console.info(`DATABASE_SEEDING_COMPLETED (${duration}ms)\n`);
}

/* ENTRYPOINT */

runSeeders()
    .then(() => {
      console.info("SEED_FINISHED\n");
    })
    .catch((err) => {
      console.error("SEED_FAILED", err);
      process.exit(1);
    });