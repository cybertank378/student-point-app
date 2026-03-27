//Files: prisma/seed/master/violation.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"
import { violationMaster } from "../../seeder_utils"

class ViolationSeeder extends BaseSeeder {

    readonly name = "MASTER_VIOLATION"

    protected async seed(): Promise<void> {

        /**
         * Ambil semua violation yang sudah ada
         */

        const existing = await prisma.violation.findMany({
            select: {
                id: true,
                name: true,
                deletedAt: true
            }
        })


        const existingMap = new Map(
            existing.map(v => [v.name, v])
        )


        const toCreate = []
        const toRestore = []


        for (const violation of violationMaster) {

            const found = existingMap.get(violation.name)

            /**
             * Data belum ada → create
             */

            if (!found) {

                toCreate.push({
                    name: violation.name,
                    point: violation.point,
                    level: violation.level
                })

                continue
            }


            /**
             * Data pernah soft delete → restore
             */

            if (found.deletedAt) {

                toRestore.push(found.id)

            }

        }


        /**
         * Bulk create (scalable)
         */

        if (toCreate.length > 0) {

            await prisma.violation.createMany({
                data: toCreate,
                skipDuplicates: true
            })

        }


        /**
         * Restore soft deleted records
         */

        if (toRestore.length > 0) {

            await prisma.violation.updateMany({
                where: {
                    id: {
                        in: toRestore
                    }
                },
                data: {
                    deletedAt: null
                }
            })

        }


        /**
         * Sync update jika point atau level berubah
         */

        for (const violation of violationMaster) {

            await prisma.violation.update({
                where: {
                    name: violation.name
                },
                data: {
                    point: violation.point,
                    level: violation.level
                }
            })

        }

    }

}

export default new ViolationSeeder()