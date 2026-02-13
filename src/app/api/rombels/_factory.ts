//Files: src/app/api/api/rombels/_factory.ts

import { RombelRepository } from "@/modules/rombel/infrastructure/repo/RombelRepository";
import { RombelService } from "@/modules/rombel/application/services/RombelService";
import { RombelController } from "@/modules/rombel/infrastructure/http/RombelController";

export function createRombelController(): RombelController {
    const repo = new RombelRepository();
    const service = new RombelService(repo);
    return new RombelController(service);
}
