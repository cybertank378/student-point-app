import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import {
    EducationLevel,
    ParentType,
    Role
} from "@/generated/prisma"

import {
    generateIndonesianPhone,
    hashPassword
} from "../../seeder_utils"

faker.seed(6001)

class ParentSeeder extends BaseSeeder {

    readonly name = "PARENT_FAMILY_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: { id: true, nis: true }
            })

            const religions = await tx.religion.findMany({
                select: { kode: true }
            })

            const passwordHash = await hashPassword("password123")

            const shuffled = faker.helpers.shuffle(students)

            const families: typeof students[] = []

            for (let i = 0; i < shuffled.length; i += 2) {
                families.push([
                    shuffled[i],
                    shuffled[i + 1]
                ].filter(Boolean))
            }

            const parentDataset: any[] = []

            const familyMap: {
                fatherPhone: string
                motherPhone: string
                students: string[]
            }[] = []

            const createParentData = () => {

                const religion = faker.helpers.arrayElement(religions)

                const phone = generateIndonesianPhone()

                return {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    education: faker.helpers.arrayElement(
                        Object.values(EducationLevel)
                    ),
                    job: faker.person.jobTitle(),
                    income: faker.helpers.arrayElement([
                        "1-3 juta",
                        "3-5 juta",
                        "5-10 juta",
                        ">10 juta"
                    ]),
                    religionCode: religion.kode,
                    phone,
                    address: faker.location.streetAddress()
                }

            }

            for (const siblings of families) {

                const father = createParentData()
                const mother = createParentData()

                parentDataset.push(father, mother)

                familyMap.push({
                    fatherPhone: father.phone,
                    motherPhone: mother.phone,
                    students: siblings.map(s => s.id)
                })

            }

            if (parentDataset.length > 0) {
                await tx.parent.createMany({
                    data: parentDataset,
                    skipDuplicates: true
                })
            }

            const parents = await tx.parent.findMany({
                select: { id: true, phone: true }
            })

            const parentMap = new Map(
                parents.map(p => [p.phone, p.id])
            )

            const studentParentDataset: any[] = []
            const userDataset: any[] = []

            for (const family of familyMap) {

                const fatherId = parentMap.get(family.fatherPhone)
                const motherId = parentMap.get(family.motherPhone)

                if (!fatherId || !motherId) continue

                userDataset.push({
                    username: family.fatherPhone,
                    password: passwordHash,
                    role: Role.PARENT,
                    parentId: fatherId,
                    isActive: true,
                    mustChangePassword: true,
                    version: 1,
                    failedAttempts: 0
                })

                for (const studentId of family.students) {

                    studentParentDataset.push({
                        studentId,
                        parentId: fatherId,
                        role: ParentType.FATHER
                    })

                    studentParentDataset.push({
                        studentId,
                        parentId: motherId,
                        role: ParentType.MOTHER
                    })

                }

            }

            if (studentParentDataset.length > 0) {
                await tx.studentParent.createMany({
                    data: studentParentDataset,
                    skipDuplicates: true
                })
            }

            if (userDataset.length > 0) {
                await tx.user.createMany({
                    data: userDataset,
                    skipDuplicates: true
                })
            }

        })

    }

}

export default new ParentSeeder()