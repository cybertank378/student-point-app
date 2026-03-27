import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import {
    generateTeacherName,
    generateTeacherEmail,
    generateIndonesianPhone,
    generateNRG,
    hashPassword
} from "../../seeder_utils"

import { fakerID_ID as faker } from "@faker-js/faker"

import {
    Gender,
    TeacherRole,
    EducationLevel,
    CivilServantRank,
    Role
} from "@/generated/prisma"

faker.seed(2024)

class TeacherSeeder extends BaseSeeder {

    readonly name = "TEACHER_SEEDER"

    protected async seed(): Promise<void> {

        const academicYear = await prisma.academicYear.findFirst({
            where: { isActive: true }
        })

        if (!academicYear) {
            throw new Error("Active academic year not found")
        }

        const religion = await prisma.religion.findFirst({
            where: { kode: "ISL" }
        })

        if (!religion) {
            throw new Error("Religion master not seeded")
        }

        const passwordHash = await hashPassword("password123")

        const teacherDataset: any[] = []
        const userDataset: any[] = []

        const grades = ["VII","VIII","XI"]
        const classNames = ["1","2","3","4"]

        let teacherIndex = 1

        const homeroomAssignments: {
            teacherNrg:string
            grade:string
            name:string
        }[] = []

        /* ================= HOMEROOM TEACHERS ================= */

        for (const grade of grades) {

            for (const name of classNames) {

                const teacherName = generateTeacherName()

                const nrg = generateNRG(
                    2015,
                    faker.number.int({min:1,max:50}),
                    teacherIndex++
                )

                const teacherId = faker.string.uuid()

                teacherDataset.push({

                    id: teacherId,

                    nrg,

                    nip: faker.string.numeric(18),
                    nuptk: faker.string.numeric(16),
                    nrk: faker.string.numeric(6),

                    name: teacherName,

                    gender: faker.helpers.arrayElement([
                        Gender.MALE,
                        Gender.FEMALE
                    ]),

                    religionCode: religion.kode,

                    phone: generateIndonesianPhone(),
                    email: generateTeacherEmail(teacherName),

                    educationLevel: EducationLevel.S1,
                    major: "Pendidikan",

                    graduationYear: faker.number.int({
                        min:2005,
                        max:2018
                    }),

                    birthPlace: faker.location.city(),

                    birthDate: faker.date.birthdate({
                        min:28,
                        max:50,
                        mode:"age"
                    }),

                    civilServantRank: faker.helpers.arrayElement(
                        Object.values(CivilServantRank)
                    ),

                    roles:[TeacherRole.HOMEROOM],

                    isPns: faker.datatype.boolean()

                })

                userDataset.push({

                    username: nrg,
                    password: passwordHash,

                    role: Role.TEACHER,
                    teacherRole: TeacherRole.HOMEROOM,

                    teacherId,

                    isActive: true,
                    mustChangePassword: true,
                    version: 1,
                    failedAttempts: 0

                })

                homeroomAssignments.push({
                    teacherNrg: nrg,
                    grade,
                    name
                })

            }

        }

        /* ================= COUNSELOR ================= */

        const counselorName = generateTeacherName()

        const counselorId = faker.string.uuid()

        const counselorNrg = generateNRG(2014,999,1)

        teacherDataset.push({

            id: counselorId,

            nrg: counselorNrg,

            nip: faker.string.numeric(18),
            nuptk: faker.string.numeric(16),
            nrk: faker.string.numeric(6),

            name: counselorName,
            gender: Gender.FEMALE,

            religionCode: religion.kode,

            phone: generateIndonesianPhone(),
            email: generateTeacherEmail(counselorName),

            educationLevel: EducationLevel.S2,
            major: "Bimbingan Konseling",

            graduationYear: 2014,

            birthPlace: faker.location.city(),

            birthDate: faker.date.birthdate({
                min:30,
                max:55,
                mode:"age"
            }),

            civilServantRank: CivilServantRank.III_B,

            roles:[TeacherRole.COUNSELOR],

            isPns:true

        })

        userDataset.push({

            username: counselorNrg,
            password: passwordHash,

            role: Role.TEACHER,
            teacherRole: TeacherRole.COUNSELOR,

            teacherId: counselorId,

            isActive: true,
            mustChangePassword: true,
            version: 1,
            failedAttempts: 0

        })

        /* ================= SUBJECT TEACHERS ================= */

        const subjectTeacherCount = 12

        for(let i=0;i<subjectTeacherCount;i++){

            const name = generateTeacherName()

            const teacherId = faker.string.uuid()

            const nrg = generateNRG(
                2012,
                faker.number.int({min:10,max:120}),
                i+50
            )

            teacherDataset.push({

                id: teacherId,

                nrg,

                nip: faker.string.numeric(18),
                nuptk: faker.string.numeric(16),
                nrk: faker.string.numeric(6),

                name,

                gender: faker.helpers.arrayElement([
                    Gender.MALE,
                    Gender.FEMALE
                ]),

                religionCode: religion.kode,

                phone: generateIndonesianPhone(),
                email: generateTeacherEmail(name),

                educationLevel: EducationLevel.S1,
                major:"Pendidikan",

                graduationYear: faker.number.int({
                    min:2003,
                    max:2018
                }),

                birthPlace: faker.location.city(),

                birthDate: faker.date.birthdate({
                    min:27,
                    max:55,
                    mode:"age"
                }),

                civilServantRank: faker.helpers.arrayElement(
                    Object.values(CivilServantRank)
                ),

                roles:[TeacherRole.SUBJECT_TEACHER],

                isPns: faker.datatype.boolean()

            })

            userDataset.push({

                username: nrg,
                password: passwordHash,

                role: Role.TEACHER,
                teacherRole: TeacherRole.SUBJECT_TEACHER,

                teacherId,

                isActive: true,
                mustChangePassword: true,
                version: 1,
                failedAttempts: 0

            })

        }

        /* ================= INSERT ================= */

        await prisma.teacher.createMany({
            data: teacherDataset,
            skipDuplicates: true
        })

        await prisma.user.createMany({
            data: userDataset,
            skipDuplicates: true
        })

        /* ================= ASSIGN HOMEROOM ================= */

        for (const assignment of homeroomAssignments) {

            const teacher = await prisma.teacher.findUnique({
                where:{ nrg: assignment.teacherNrg }
            })

            if (!teacher) continue

            const classData = await prisma.class.findFirst({
                where:{
                    grade: assignment.grade,
                    name: assignment.name,
                    academicYearId: academicYear.id
                }
            })

            if (!classData) continue

            await prisma.class.update({
                where:{ id: classData.id },
                data:{ homeroomTeacherId: teacher.id }
            })

        }

    }

}

export default new TeacherSeeder()