//Files: prisma/seeders/class/class.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

class ClassSeeder extends BaseSeeder {

    readonly name = "MASTER_CLASS"

    protected async seed(): Promise<void> {

        /**
         * Ambil tahun ajaran aktif
         */

        const academicYear = await prisma.academicYear.findFirst({
            where: { isActive: true }
        })

        if (!academicYear) {
            throw new Error("Active academic year not found")
        }


        /**
         * Dataset kelas
         * scalable jika nanti ingin tambah kelas
         */

        const grades = ["VII", "VIII", "XI"]

        const classNames = ["1", "2", "3", "4"]


        /**
         * Generate dataset
         */

        const dataset: {
            grade: string
            name: string
            academicYearId: string
        }[] = []

        for (const grade of grades) {
            for (const name of classNames) {

                dataset.push({
                    grade,
                    name,
                    academicYearId: academicYear.id
                })

            }
        }


        /**
         * Idempotent creation
         */

        for (const item of dataset) {

            await prisma.class.upsert({

                where: {
                    grade_name_academicYearId: {
                        grade: item.grade,
                        name: item.name,
                        academicYearId: item.academicYearId
                    }
                },

                update: {},

                create: {
                    grade: item.grade,
                    name: item.name,
                    academicYearId: item.academicYearId
                }

            })

        }

    }

}

export default new ClassSeeder()