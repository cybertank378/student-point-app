// Files: prisma/seed/student/studentFamily.seedRunner.ts

import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import { HouseOwnership } from "@/generated/prisma"

faker.seed(2201)

class StudentFamilySeeder extends BaseSeeder {

    readonly name = "STUDENT_FAMILY_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true,
                    address: true
                }
            })

            const livingOptions = [
                "Orang Tua",
                "Ayah",
                "Ibu",
                "Wali",
                "Kakek Nenek"
            ]

            const houseOwnershipOptions = [
                HouseOwnership.OWNED,
                HouseOwnership.RENT,
                HouseOwnership.FAMILY,
                HouseOwnership.GOVERNMENT,
                HouseOwnership.OTHER
            ]

            const dataset: {
                studentId: string
                livingWith: string
                houseOwnership: HouseOwnership
                headOfFamilyName: string
                familyCardAddress: string
                documents: string[]
            }[] = []

            for (const student of students) {

                dataset.push({

                    studentId: student.id,

                    livingWith: faker.helpers.arrayElement(livingOptions),

                    houseOwnership: faker.helpers.arrayElement(houseOwnershipOptions),

                    headOfFamilyName: faker.person.fullName(),

                    familyCardAddress: student.address,

                    documents: []

                })

            }

            await tx.studentFamilyInfo.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new StudentFamilySeeder()