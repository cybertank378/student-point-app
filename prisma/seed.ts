//Files: prisma/seed.ts
import prisma from "@/libs/prisma";
import { runSeeders } from "./seed/seedRunner";

async function bootstrap() {
  try {
    await runSeeders();
  } catch (error) {
    console.error("SEEDING_ABORTED");

    console.error(error);

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
