//Files: prisma/seed/master/achievement.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

class AchievementSeeder extends BaseSeeder {

    readonly name = "MASTER_ACHIEVEMENT"

    protected async seed(): Promise<void> {

        /**
         * Deterministic dataset
         * scalable untuk berbagai kategori prestasi
         */

        const dataset = [

            /* ACADEMIC */

            { name: "Juara 1 Olimpiade Sains Nasional", point: 100 },
            { name: "Juara 2 Olimpiade Sains Nasional", point: 90 },
            { name: "Juara 3 Olimpiade Sains Nasional", point: 80 },

            { name: "Juara 1 Kompetisi Akademik Provinsi", point: 75 },
            { name: "Juara 2 Kompetisi Akademik Provinsi", point: 65 },
            { name: "Juara 3 Kompetisi Akademik Provinsi", point: 55 },

            { name: "Juara 1 Kompetisi Akademik Kota", point: 50 },
            { name: "Juara 2 Kompetisi Akademik Kota", point: 40 },
            { name: "Juara 3 Kompetisi Akademik Kota", point: 30 },

            /* NON ACADEMIC */

            { name: "Juara 1 Lomba Olahraga Nasional", point: 80 },
            { name: "Juara 2 Lomba Olahraga Nasional", point: 70 },
            { name: "Juara 3 Lomba Olahraga Nasional", point: 60 },

            { name: "Juara 1 Lomba Seni Nasional", point: 80 },
            { name: "Juara 2 Lomba Seni Nasional", point: 70 },
            { name: "Juara 3 Lomba Seni Nasional", point: 60 },

            { name: "Juara 1 Lomba Olahraga Provinsi", point: 60 },
            { name: "Juara 2 Lomba Olahraga Provinsi", point: 50 },
            { name: "Juara 3 Lomba Olahraga Provinsi", point: 40 },

            { name: "Juara 1 Lomba Seni Provinsi", point: 60 },
            { name: "Juara 2 Lomba Seni Provinsi", point: 50 },
            { name: "Juara 3 Lomba Seni Provinsi", point: 40 }

        ]


        /**
         * Upsert for idempotent execution
         */

        for (const achievement of dataset) {

            await prisma.achievement.upsert({

                where: {
                    name: achievement.name
                },

                update: {
                    point: achievement.point,
                    deletedAt: null
                },

                create: {
                    name: achievement.name,
                    point: achievement.point
                }

            })

        }

    }

}

export default new AchievementSeeder()