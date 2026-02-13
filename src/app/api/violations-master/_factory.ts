// Files: src/app/api/violations-master/_factory.ts

import {ViolationController} from "@/modules/violation/infrastructur/http/ViolationController";
import {ViolationRepository} from "@/modules/violation/infrastructur/repo/ViolationRepository";
import {ViolationService} from "@/modules/violation/application/services/ViolationService";

/**
 * Factory untuk ViolationController
 * --------------------------------
 * Tempat wiring dependency:
 * Repo -> Service -> Controller
 *
 * NOTE:
 * - Tidak ada logic bisnis
 * - Tidak ada singleton state
 * - Aman untuk serverless / edge
 */
export function createViolationController(): ViolationController {
    const repository = new ViolationRepository();
    const service = new ViolationService(repository);

    return new ViolationController(service);
}
