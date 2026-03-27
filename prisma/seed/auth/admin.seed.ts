//Files: prisma/seed/auth/admin.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"
import { hashPassword } from "../../seeder_utils"
import { Role } from "@/generated/prisma"

class adminUserSeeder extends BaseSeeder {

    readonly name = "SYSTEM_ADMIN_USER"

    protected async seed(): Promise<void> {

        const username = "admin"

        /**
         * default credential
         * sebaiknya diganti di production
         */

        const defaultPassword = "password123"

        const passwordHash = await hashPassword(defaultPassword)


        /**
         * check existing admin
         */

        const existing = await prisma.user.findUnique({
            where: { username }
        })


        if (!existing) {

            /**
             * create admin
             */

            await prisma.user.create({

                data: {
                    username,
                    password: passwordHash,
                    role: Role.ADMIN,
                    isActive: true,
                    mustChangePassword: true,
                    version: 1,
                    failedAttempts: 0
                }

            })

            return
        }


        /**
         * ensure admin properties stay consistent
         */

        await prisma.user.update({

            where: { username },

            data: {
                role: Role.ADMIN,
                isActive: true
            }

        })

    }

}

export default new adminUserSeeder()