import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import {
    generateNis,
    generateNisn,
    generateFamilyStatus,
    generateIndonesianPhone,
    hashPassword
} from "../../seeder_utils"

import { fakerID_ID as faker } from "@faker-js/faker"

import {
    Gender,
    Role
} from "@/generated/prisma"

faker.seed(1001)

class StudentSeeder extends BaseSeeder {

    readonly name = "STUDENT_SEEDER"

    protected async seed(): Promise<void> {

        const religion = await prisma.religion.findFirst({
            where: { kode: "ISL" }
        })

        if (!religion) {
            throw new Error("Religion master not found")
        }

        const passwordHash = await hashPassword("password123")

        const grades = ["VII","VIII","XI"]
        const classNames = ["1","2","3","4"]

        const studentsPerClass = 30

        const totalStudents =
            grades.length * classNames.length * studentsPerClass

        const difableTarget = Math.floor(totalStudents * 0.06)

        const difableIndexes = new Set<number>()

        while (difableIndexes.size < difableTarget) {

            difableIndexes.add(
                faker.number.int({
                    min: 0,
                    max: totalStudents - 1
                })
            )

        }

        let studentIndex = 0

        const studentDataset: any[] = []

        for (let g = 0; g < grades.length; g++) {

            for (let c = 0; c < classNames.length; c++) {

                for (let i = 0; i < studentsPerClass; i++) {

                    const nis = generateNis(studentIndex)
                    const nisn = generateNisn(studentIndex)

                    const gender = faker.helpers.arrayElement([
                        Gender.MALE,
                        Gender.FEMALE
                    ])

                    const isDifable = difableIndexes.has(studentIndex)

                    studentDataset.push({

                        nis,
                        nisn,

                        name: faker.person.fullName(),
                        nickname: faker.person.firstName(),

                        gender,

                        birthPlace: faker.location.city(),

                        birthDate: faker.date.birthdate({
                            min: 12,
                            max: 15,
                            mode: "age"
                        }),

                        address: faker.location.streetAddress(),

                        phone: generateIndonesianPhone(),

                        email: faker.internet.email(),

                        religionCode: religion.kode,

                        nik: faker.string.numeric(16),

                        kkNumber: faker.string.numeric(16),

                        schoolOrigin: "SD Negeri",

                        graduationScore: faker.number.float({
                            min: 70,
                            max: 100,
                            fractionDigits: 2
                        }),

                        instagram: faker.internet.username(),

                        familyStatus: generateFamilyStatus(),

                        isDifable,

                        difableNotes: isDifable
                            ? "Kebutuhan khusus ringan"
                            : null

                    })

                    studentIndex++

                }

            }

        }

        /* INSERT STUDENTS */

        await prisma.student.createMany({

            data: studentDataset,

            skipDuplicates: true

        })


        /* FETCH STUDENTS */

        const students = await prisma.student.findMany({

            where: {
                nis: { not: null }
            },

            select: {
                id: true,
                nis: true
            }

        })


        /* BUILD USER DATASET */

        const userDataset = students.map(student => ({

            username: student.nis!,

            password: passwordHash,

            role: Role.STUDENT,

            studentId: student.id,

            isActive: true,
            mustChangePassword: true,
            version: 1,
            failedAttempts: 0

        }))


        /* INSERT USERS */

        await prisma.user.createMany({

            data: userDataset,

            skipDuplicates: true

        })

    }

}

export default new StudentSeeder()