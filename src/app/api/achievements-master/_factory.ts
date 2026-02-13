//Files: src/app/api/achievements/_factory.ts
import { AchievementController } from "@/modules/achievement/infrastructure/http/AchievementController";
import { AchievementService } from "@/modules/achievement/application/services/AchievementService";
import { AchievementRepository } from "@/modules/achievement/infrastructure/repo/AchievementRepository";

export function createAchievementController() {
    const repo = new AchievementRepository();
    const service = new AchievementService(repo);
    return new AchievementController(service);
}
