// Files: src/app/api/violations-master/route.ts

import { createViolationController } from "./_factory";

/**
 * ============================================================
 * VIOLATION MASTER COLLECTION ROUTE
 * ============================================================
 *
 * Path:
 *   /api/violations-master
 *
 * ------------------------------------------------------------
 * RESPONSIBILITY
 * ------------------------------------------------------------
 * - HTTP entry point for violation master collection
 * - Delegates all logic to controller
 * - Contains NO business logic
 * - Contains NO database logic
 *
 * ------------------------------------------------------------
 * SUPPORTED OPERATIONS
 * ------------------------------------------------------------
 * GET  → Paginated list
 * POST → Create new violation master
 *
 * ------------------------------------------------------------
 * CLEAN ARCHITECTURE
 * ------------------------------------------------------------
 * Route layer belongs to Interface Adapter.
 * It must:
 * - Only forward request
 * - Not know domain logic
 * - Not know database
 *
 * Stateless and safe for serverless runtime.
 * ============================================================
 */


/* ============================================================
   GET /api/violations-master
   ------------------------------------------------------------
   Query Params:
   - page
   - limit
   - search
   - sortBy
   - sortOrder
   ------------------------------------------------------------
   Returns:
   BasePaginationResponse<Violation>
   ------------------------------------------------------------
   Delegates to:
   ViolationController.list()
============================================================ */

export async function GET(request: Request) {
    const controller = createViolationController();
    return controller.list(request);
}


/* ============================================================
   POST /api/violations-master
   ------------------------------------------------------------
   Description:
   - Create new violation master record
   - Body must match CreateViolationDTO
   ------------------------------------------------------------
   Delegates to:
   ViolationController.create()
============================================================ */

export async function POST(request: Request) {
    const controller = createViolationController();
    return controller.create(request);
}