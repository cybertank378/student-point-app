//Files: prisma/seed/student/studentProfile.seedRunner.ts

import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

faker.seed(2001)

class StudentProfileSeeder extends BaseSeeder {

    readonly name = "STUDENT_PROFILE_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true,
                    name: true
                }
            })

            const hobbies = [
                "Sepak Bola",
                "Badminton",
                "Membaca",
                "Menggambar",
                "Bermain Game",
                "Futsal",
                "Basket",
                "Musik",
                "Menulis",
                "Pramuka"
            ]

            const dreams = [
                "Dokter",
                "Guru",
                "Polisi",
                "Tentara",
                "Programmer",
                "Pilot",
                "Arsitek",
                "Pengusaha",
                "Desainer",
                "Atlet"
            ]

            const transports = [
                "Jalan kaki",
                "Sepeda",
                "Motor orang tua",
                "Angkot",
                "Bus sekolah"
            ]

            const dataset: {
                studentId: string
                childOrder: number
                totalSiblings: number
                distanceToSchool: string
                transport: string
                hobby: string
                dream: string
                closeFriend: string
            }[] = []


            for (const student of students) {

                const siblings = faker.number.int({
                    min: 1,
                    max: 5
                })

                dataset.push({

                    studentId: student.id,

                    childOrder: faker.number.int({
                        min: 1,
                        max: siblings
                    }),

                    totalSiblings: siblings,

                    distanceToSchool: `${faker.number.int({
                        min: 1,
                        max: 15
                    })} km`,

                    transport: faker.helpers.arrayElement(transports),

                    hobby: faker.helpers.arrayElement(hobbies),

                    dream: faker.helpers.arrayElement(dreams),

                    closeFriend: faker.person.firstName()

                })

            }


            await tx.studentProfile.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new StudentProfileSeeder()