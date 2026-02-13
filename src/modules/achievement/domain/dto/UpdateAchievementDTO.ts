//Files: src/modules/achievement/domain/dto/UpdateAchievementDTO.ts

/**
 * Payload untuk update Achievement
 * id berasal dari parameter, bukan HTTP body
 */
export interface UpdateAchievementDTO {
    id: string;
    name: string;
    point: number;
}