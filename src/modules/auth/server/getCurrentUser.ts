//Files: src/modules/auth/server/getCurrentUser.ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/shared/core/jwt";
import { refreshAccessToken } from "./refreshAccessToken";
import { serverLog } from "@/libs/serverLogger";
import type AuthPayload from "@/modules/auth/domain/entity/AuthPayload";

export async function getCurrentUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    serverLog("getCurrentUser → No access token");
    return null;
  }

  const decoded = await verifyAccessToken(token);

  if (decoded && typeof decoded.sub === "string") {
    return decoded as AuthPayload;
  }

  // 🔥 Access expired → try refresh
  serverLog("Access expired → trying refresh");

  return await refreshAccessToken();
}
