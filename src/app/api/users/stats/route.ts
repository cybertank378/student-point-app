//Files: src/app/api/users/stats/route.ts

import {userController} from "@/app/api/users/_factory";


/**
 * ======================================
 * GET USER STATS
 * GET /api/users/stats
 * ======================================
 */
export async function GET() {
    return userController.getStats();
}