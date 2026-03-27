//Files: src/security/roleMenuPolicy.ts
import type { IconType } from "react-icons";
import {
  MdAccountBalance,
  MdAssignment,
  MdClass,
  MdDashboard,
  MdFactCheck,
  MdGavel,
  MdLock,
  MdManageAccounts,
  MdMenuBook,
  MdOutlineReport,
  MdPeople,
  MdPerson,
} from "react-icons/md";

import type { Role } from "@/libs/utils/enums";
import type { Permission } from "@/security/permissions";
import { PERMISSIONS } from "@/security/permissions";

/* =====================================================
 SIDEBAR MENU TYPE
 ===================================================== */

export interface SidebarMenuItem {
  label: string;
  path?: string;
  icon?: IconType;
  permission?: Permission;
  children?: readonly SidebarMenuItem[];
}

/* =====================================================
 BASE MENU (ALL ROLES)
 ===================================================== */

const BASE_MENU: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: MdDashboard,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
];

/* =====================================================
 ROLE BASED MENU
 ===================================================== */

const ROLE_MENU: Record<Role, SidebarMenuItem[]> = {
  /* =====================================================
   ADMIN
   ===================================================== */

  ADMIN: [
    {
      label: "Master Akademik",
      icon: MdManageAccounts,
      children: [
        {
          label: "Tahun Ajaran",
          path: "/dashboard/academic-years",
          icon: MdMenuBook,
          permission: PERMISSIONS.ACADEMIC_YEAR_READ,
        },
        {
          label: "Kelas (Rombel)",
          path: "/dashboard/rombels",
          icon: MdClass,
          permission: PERMISSIONS.ROMBEL_READ,
        },
        {
          label: "Agama",
          path: "/dashboard/religions",
          icon: MdAccountBalance,
          permission: PERMISSIONS.RELIGION_READ,
        },
      ],
    },

    {
      label: "Manajemen Pengguna",
      icon: MdPeople,
      children: [
        {
          label: "User",
          path: "/dashboard/users",
          permission: PERMISSIONS.USER_READ,
        },
        {
          label: "Guru",
          path: "/dashboard/teachers",
          permission: PERMISSIONS.TEACHER_READ,
        },
        {
          label: "Siswa",
          path: "/dashboard/students",
          permission: PERMISSIONS.STUDENT_READ,
        },
      ],
    },

    {
      label: "Master Disiplin",
      icon: MdGavel,
      children: [
        {
          label: "Master Pelanggaran",
          path: "/dashboard/violations/master",
          permission: PERMISSIONS.VIOLATION_READ,
        },
        {
          label: "Master Prestasi",
          path: "/dashboard/achievements/master",
          permission: PERMISSIONS.ACHIEVEMENT_READ,
        },
      ],
    },

    {
      label: "Monitoring Sistem",
      icon: MdAssignment,
      children: [
        {
          label: "Semua Pelanggaran",
          path: "/dashboard/violations/records",
          permission: PERMISSIONS.VIOLATION_READ,
        },
        {
          label: "Semua Resolusi",
          path: "/dashboard/resolutions",
          permission: PERMISSIONS.COUNSELING_READ,
        },
        {
          label: "Progres Penanganan",
          path: "/dashboard/handling",
          permission: PERMISSIONS.COUNSELING_READ,
        },
      ],
    },

    {
      label: "Laporan",
      icon: MdOutlineReport,
      children: [
        {
          label: "Laporan Kehadiran",
          path: "/dashboard/reports/attendance",
          permission: PERMISSIONS.REPORT_READ,
        },
        {
          label: "Laporan Pelanggaran",
          path: "/dashboard/reports/violations",
          permission: PERMISSIONS.REPORT_READ,
        },
        {
          label: "Laporan Disiplin",
          path: "/dashboard/reports/discipline",
          permission: PERMISSIONS.REPORT_READ,
        },
      ],
    },

    {
      label: "Akun",
      icon: MdPerson,
      children: [
        {
          label: "Ganti Password",
          path: "/dashboard/change-password",
          icon: MdLock,
          permission: PERMISSIONS.DASHBOARD_VIEW,
        },
      ],
    },
  ],

  /* =====================================================
   TEACHER
   ===================================================== */

  TEACHER: [
    {
      label: "Kehadiran",
      icon: MdFactCheck,
      children: [
        {
          label: "Absensi Harian",
          path: "/dashboard/attendance/daily",
          permission: PERMISSIONS.ATTENDANCE_READ,
        },
        {
          label: "Rekap Bulanan",
          path: "/dashboard/attendance/monthly",
          permission: PERMISSIONS.ATTENDANCE_READ,
        },
      ],
    },

    {
      label: "Pelanggaran",
      icon: MdGavel,
      children: [
        {
          label: "Input Pelanggaran",
          path: "/dashboard/violations/input",
          permission: PERMISSIONS.VIOLATION_MANAGE,
        },
        {
          label: "Data Pelanggaran",
          path: "/dashboard/violations/records",
          permission: PERMISSIONS.VIOLATION_READ,
        },
        {
          label: "Monitoring Penanganan",
          path: "/dashboard/handling",
          permission: PERMISSIONS.COUNSELING_READ,
        },
      ],
    },
  ],

  /* =====================================================
   STUDENT
   ===================================================== */

  STUDENT: [
    {
      label: "Profil Saya",
      path: "/dashboard/profile",
      icon: MdPerson,
      permission: PERMISSIONS.STUDENT_READ,
    },

    {
      label: "Kehadiran Saya",
      icon: MdFactCheck,
      children: [
        {
          label: "Rekap Kehadiran",
          path: "/dashboard/attendance",
          permission: PERMISSIONS.ATTENDANCE_READ,
        },
      ],
    },

    {
      label: "Pelanggaran Saya",
      icon: MdGavel,
      children: [
        {
          label: "Riwayat Pelanggaran",
          path: "/dashboard/violations",
          permission: PERMISSIONS.VIOLATION_READ,
        },
      ],
    },
  ],

  /* =====================================================
   PARENT
   ===================================================== */

  PARENT: [
    {
      label: "Monitoring Anak",
      icon: MdFactCheck,
      children: [
        {
          label: "Kehadiran Anak",
          path: "/dashboard/attendance",
          permission: PERMISSIONS.ATTENDANCE_READ,
        },
        {
          label: "Pelanggaran Anak",
          path: "/dashboard/violations",
          permission: PERMISSIONS.VIOLATION_READ,
        },
      ],
    },
  ],
};

/* =====================================================
 FILTER MENU BY PERMISSION
 ===================================================== */

function filterMenuByPermission(menu: SidebarMenuItem[], permissions: Permission[]): SidebarMenuItem[] {
  return menu
    .filter((item) => {
      if (!item.permission) return true;
      return permissions.includes(item.permission);
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByPermission(item.children as SidebarMenuItem[], permissions) : undefined,
    }));
}

/* =====================================================
 EXPORT FUNCTION
 ===================================================== */

export function getRoleMenu(role: Role, permissions: Permission[]): SidebarMenuItem[] {
  const menu = [...BASE_MENU, ...(ROLE_MENU[role] ?? [])];

  return filterMenuByPermission(menu, permissions);
}
