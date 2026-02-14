//Files: src/modules/auth/application/usecase/RequestResetPasswordUseCase.ts

import { FIFTEEN_MINUTES } from "@/libs/utils";
import { randomUUID } from "node:crypto";
import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";

export class RequestResetPasswordUseCase {
  constructor(
    private readonly repo: AuthRepositoryInterface,
    private readonly hash: HashServiceInterface,
  ) {}

  async execute(username: string): Promise<string> {
    const user = await this.repo.findByUsername(username);

    if (!user) throw new Error("User not found");

    const rawToken = randomUUID();

    const hashedToken = await this.hash.hash(rawToken);

    await this.repo.createResetToken(
      user.id,
      hashedToken,
      new Date(Date.now() + FIFTEEN_MINUTES),
    );

    return rawToken;
  }
}
