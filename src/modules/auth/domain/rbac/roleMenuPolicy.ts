//Files: src/modules/auth/domain/rbac/roleMenuPolicy.ts
import { IconType } from "react-icons";
import {
    MdPeople,
    MdFactCheck,
    MdGavel,
    MdAssignment,
    MdOutlineReport,
    MdPerson,
    MdLock,
    MdDashboard,
    MdManageAccounts,
    MdClass,
    MdMenuBook,
    MdAccountBalance,
} from "react-icons/md";

import { UserRole } from "@/libs/utils";
import {Permission} from "@/modules/auth/domain/rbac/permissions";

/**
 * =====================================================
 * SIDEBAR MENU TYPE (UNLIMITED DEPTH)
 * =====================================================
 */
export interface SidebarMenuItem {
    label: string;
    path?: string;
    icon?: IconType;
    permission?: Permission; // ✅ TAMBAHKAN INI
    children?: readonly SidebarMenuItem[];
}

/**
 * =====================================================
 * BASE MENU (ALL ROLES)
 * =====================================================
 */
const BASE_MENU: SidebarMenuItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: MdDashboard,
    },
];

/**
 * =====================================================
 * ROLE BASED MENU
 * =====================================================
 */
const ROLE_MENU: Record<UserRole, SidebarMenuItem[]> = {
    /**
     * =====================================================
     * ADMIN
     * =====================================================
     */
    ADMIN: [
        // =============================
        // MASTER AKADEMIK
        // =============================
        {
            label: "Master Akademik",
            icon: MdManageAccounts,
            children: [
                { label: "Tahun Ajaran", path: "/dashboard/academic-years", icon: MdMenuBook },
                { label: "Kelas (Rombel)", path: "/dashboard/rombels", icon: MdClass },
                { label: "Agama", path: "/dashboard/religions", icon: MdAccountBalance },
            ],
        },

        // =============================
        // DATA PENGGUNA
        // =============================
        {
            label: "Manajemen Pengguna",
            icon: MdPeople,
            children: [
                { label: "User", path: "/dashboard/users" },
                { label: "Guru", path: "/dashboard/teachers" },
                { label: "Siswa", path: "/dashboard/students" },
                { label: "Orang Tua", path: "/dashboard/parents" },
            ],
        },

        // =============================
        // MASTER PELANGGARAN & PRESTASI
        // =============================
        {
            label: "Master Disiplin",
            icon: MdGavel,
            children: [
                { label: "Master Pelanggaran", path: "/dashboard/violations/master" },
                { label: "Master Prestasi", path: "/dashboard/achievements/master" },
            ],
        },

        // =============================
        // MONITORING GLOBAL
        // =============================
        {
            label: "Monitoring Sistem",
            icon: MdAssignment,
            children: [
                { label: "Semua Pelanggaran", path: "/dashboard/violations/records" },
                { label: "Semua Resolusi", path: "/dashboard/resolutions" },
                { label: "Progres Penanganan", path: "/dashboard/handling" },
            ],
        },

        // =============================
        // LAPORAN
        // =============================
        {
            label: "Laporan",
            icon: MdOutlineReport,
            children: [
                { label: "Laporan Kehadiran", path: "/dashboard/reports/attendance" },
                { label: "Laporan Pelanggaran", path: "/dashboard/reports/violations" },
                { label: "Laporan Disiplin", path: "/dashboard/reports/discipline" },
            ],
        },

        // =============================
        // AKUN
        // =============================
        {
            label: "Akun",
            icon: MdPerson,
            children: [
                { label: "Ganti Password", path: "/dashboard/change-password", icon: MdLock },
            ],
        },
    ],

    /**
     * =====================================================
     * TEACHER
     * =====================================================
     */
    TEACHER: [
        {
            label: "Kehadiran",
            icon: MdFactCheck,
            children: [
                { label: "Absensi Harian", path: "/dashboard/attendance/daily" },
                { label: "Rekap Bulanan", path: "/dashboard/attendance/monthly" },
            ],
        },
        {
            label: "Pelanggaran",
            icon: MdGavel,
            children: [
                { label: "Input Pelanggaran", path: "/dashboard/violations/input" },
                { label: "Data Pelanggaran", path: "/dashboard/violations/records" },
                { label: "Monitoring Penanganan", path: "/dashboard/handling" },
            ],
        },
    ],

    /**
     * =====================================================
     * STUDENT
     * =====================================================
     */
    STUDENT: [
        {
            label: "Kehadiran Saya",
            icon: MdFactCheck,
            children: [
                { label: "Rekap Kehadiran", path: "/dashboard/attendance" },
            ],
        },
        {
            label: "Pelanggaran Saya",
            icon: MdGavel,
            children: [
                { label: "Riwayat Pelanggaran", path: "/dashboard/violations" },
            ],
        },
    ],

    /**
     * =====================================================
     * PARENT
     * =====================================================
     */
    PARENT: [
        {
            label: "Monitoring Anak",
            icon: MdFactCheck,
            children: [
                { label: "Kehadiran Anak", path: "/dashboard/attendance" },
                { label: "Pelanggaran Anak", path: "/dashboard/violations" },
            ],
        },
    ],
};

/**
 * =====================================================
 * EXPORT FUNCTION
 * =====================================================
 */
export function getRoleMenu(role: UserRole): SidebarMenuItem[] {
    return [...BASE_MENU, ...(ROLE_MENU[role] ?? [])];
}
