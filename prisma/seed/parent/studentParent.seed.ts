//Files: prisma/seed/student/studentParent.seed.ts

import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import { ParentType, FamilyStatus } from "@/generated/prisma"

faker.seed(5002)

class StudentParentSeeder extends BaseSeeder {

    readonly name = "STUDENT_PARENT_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true,
                    familyStatus: true
                }
            })

            const parents = await tx.parent.findMany({
                select: { id: true }
            })

            const dataset: {
                studentId: string
                parentId: string
                role: ParentType
            }[] = []

            const pickParent = () =>
                faker.helpers.arrayElement(parents)

            for (const student of students) {

                if (student.familyStatus === FamilyStatus.COMPLETE) {

                    const father = pickParent()
                    const mother = pickParent()

                    dataset.push({
                        studentId: student.id,
                        parentId: father.id,
                        role: ParentType.FATHER
                    })

                    dataset.push({
                        studentId: student.id,
                        parentId: mother.id,
                        role: ParentType.MOTHER
                    })

                }

                else if (student.familyStatus === FamilyStatus.SINGLE_MOTHER) {

                    const mother = pickParent()

                    dataset.push({
                        studentId: student.id,
                        parentId: mother.id,
                        role: ParentType.MOTHER
                    })

                }

                else if (student.familyStatus === FamilyStatus.SINGLE_FATHER) {

                    const father = pickParent()

                    dataset.push({
                        studentId: student.id,
                        parentId: father.id,
                        role: ParentType.FATHER
                    })

                }

                else if (student.familyStatus === FamilyStatus.ORPHAN) {

                    const guardian = pickParent()

                    dataset.push({
                        studentId: student.id,
                        parentId: guardian.id,
                        role: ParentType.GUARDIAN
                    })

                }

            }

            for (const item of dataset) {

                await tx.studentParent.upsert({

                    where: {
                        studentId_role: {
                            studentId: item.studentId,
                            role: item.role
                        }
                    },

                    update: {},

                    create: item

                })

            }

        })

    }

}

export default new StudentParentSeeder()