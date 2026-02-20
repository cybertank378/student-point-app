// Files: src/app/api/violations-master/_factory.ts


import { ViolationService } from "@/modules/violation/application/services/ViolationService";
import {ViolationController} from "@/modules/violation/infrastructur/http/ViolationController";
import {ViolationRepository} from "@/modules/violation/infrastructur/repo/ViolationRepository";

/**
 * ============================================================
 * VIOLATION CONTROLLER FACTORY
 * ============================================================
 *
 * Responsibility:
 * - Wire dependency chain:
 *   Repository → Service → Controller
 *
 * This file:
 * - Contains NO business logic
 * - Contains NO HTTP logic
 * - Contains NO Prisma logic
 * - Is safe for serverless / edge runtime
 *
 * Why Factory?
 * - Prevent duplicated wiring in route files
 * - Centralize dependency construction
 * - Improve maintainability
 * - Easier future upgrade to DI container
 *
 * Clean Architecture compliant.
 * ============================================================
 */
export function createViolationController(): ViolationController {
    const repository = new ViolationRepository();
    const service = new ViolationService(repository);

    return new ViolationController(service);
}