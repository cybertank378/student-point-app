//Files: prisma/seed/student/studentReligion.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

faker.seed(2301)

class StudentReligionSeeder extends BaseSeeder {

    readonly name = "STUDENT_RELIGION_ACTIVITY_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true
                }
            })

            const quranLevels = [
                "Belum bisa membaca",
                "Iqra 1",
                "Iqra 2",
                "Iqra 3",
                "Iqra 4",
                "Iqra 5",
                "Iqra 6",
                "Al-Qur'an dasar",
                "Al-Qur'an lancar",
                "Tahsin"
            ]

            const missPrayerOptions = [
                "Jarang",
                "Kadang-kadang",
                "Sering",
                "Hampir setiap hari"
            ]

            const worshipActivities = [
                "Mengaji",
                "Sholat berjamaah",
                "Pengajian",
                "Tahfidz",
                "Tadarus",
                "Kajian remaja"
            ]

            const worshipLocations = [
                "Masjid",
                "Mushola",
                "Rumah",
                "TPA",
                "Sekolah"
            ]

            const dataset: {
                studentId: string
                prayFiveTimes: boolean
                oftenMissPrayer: string
                quranStudyLevel: string
                worshipActivities: string
                worshipLocation: string
            }[] = []

            for (const student of students) {

                const prayFiveTimes = faker.datatype.boolean({
                    probability: 0.7
                })

                dataset.push({

                    studentId: student.id,

                    prayFiveTimes,

                    oftenMissPrayer: prayFiveTimes
                        ? faker.helpers.arrayElement(["Jarang", "Kadang-kadang"])
                        : faker.helpers.arrayElement(missPrayerOptions),

                    quranStudyLevel: faker.helpers.arrayElement(quranLevels),

                    worshipActivities: faker.helpers.arrayElement(worshipActivities),

                    worshipLocation: faker.helpers.arrayElement(worshipLocations)

                })

            }

            await tx.studentReligionActivity.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new StudentReligionSeeder()