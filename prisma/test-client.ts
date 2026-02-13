import "dotenv/config"
import prisma from "@/libs/prisma";

async function test() {
    const result = await prisma.$queryRaw`SELECT 1`
    console.log("✅ Prisma Client OK:", result)
}

test()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })
