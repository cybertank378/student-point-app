//Files: src/app/api/religions/_factory.ts

import { ReligionController } from "@/modules/religion/infrastructure/http/ReligionController";
import { ReligionService } from "@/modules/religion/application/services/ReligionService";
import {ReligionRepository} from "@/modules/religion/infrastructure/repo/ReligionRepository";

export function createReligionController() {
    const repo = new ReligionRepository();
    const service = new ReligionService(repo);
    return new ReligionController(service);
}
