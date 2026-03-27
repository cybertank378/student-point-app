import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import type { Prisma } from "@/generated/prisma"

class ReligionSeeder extends BaseSeeder {

    readonly name = "MASTER_RELIGION"

    protected async seed(): Promise<void> {

        const dataset: Prisma.ReligionCreateManyInput[] = [
            { kode: "ISL", name: "Islam" },
            { kode: "KRI", name: "Kristen" },
            { kode: "KAT", name: "Katolik" },
            { kode: "HIN", name: "Hindu" },
            { kode: "BUD", name: "Buddha" },
            { kode: "KGH", name: "Konghucu" }
        ]

        await prisma.religion.createMany({
            data: dataset,
            skipDuplicates: true
        })

    }

}

export default new ReligionSeeder()