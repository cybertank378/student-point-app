//Files: src/libs/utils/enumLabels.ts

import { CivilServantRank } from "./enums"

/**
 * ============================================================
 * CIVIL SERVANT RANK LABEL MAP
 * ============================================================
 */

export const CIVIL_SERVANT_RANK_LABEL: Record<
    CivilServantRank,
    string
> = {
    I_A: "Juru Muda",
    I_B: "Juru Muda Tingkat I",
    I_C: "Juru",
    I_D: "Juru Tingkat I",

    II_A: "Pengatur Muda",
    II_B: "Pengatur Muda Tingkat I",
    II_C: "Pengatur",
    II_D: "Pengatur Tingkat I",

    III_A: "Penata Muda",
    III_B: "Penata Muda Tingkat I",
    III_C: "Penata",
    III_D: "Penata Tingkat I",

    IV_A: "Pembina",
    IV_B: "Pembina Tingkat I",
    IV_C: "Pembina Utama Muda",
    IV_D: "Pembina Utama Madya",
    IV_E: "Pembina Utama",
}