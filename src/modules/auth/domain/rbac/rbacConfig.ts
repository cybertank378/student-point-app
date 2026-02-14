// Files: src/modules/auth/domain/rbac/rbacConfig.ts
import type { UserRole } from "@/libs/utils";
import {
  PERMISSIONS,
  type Permission,
} from "@/modules/auth/domain/rbac/permissions";

/* ============================================================
   SIDEBAR TYPE
============================================================ */

export interface SidebarNode {
  label: string;
  path?: string;
  permission?: Permission;
  children?: readonly SidebarNode[];
}

/* ============================================================
   RBAC CONFIG
============================================================ */

export const rbacConfig = {
  roles: {
    ADMIN: "ALL",

    TEACHER: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ROMBEL_READ,
      PERMISSIONS.STUDENT_READ,
      PERMISSIONS.VIOLATION_READ,
      PERMISSIONS.VIOLATION_MANAGE,
      PERMISSIONS.ACHIEVEMENT_READ,
      PERMISSIONS.ACHIEVEMENT_MANAGE,
    ],

    STUDENT: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.STUDENT_READ,
      PERMISSIONS.VIOLATION_READ,
      PERMISSIONS.ACHIEVEMENT_READ,
    ],

    PARENT: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.STUDENT_READ,
      PERMISSIONS.VIOLATION_READ,
    ],
  } as Record<UserRole, "ALL" | Permission[]>,

  dashboard: {
    "/dashboard": PERMISSIONS.DASHBOARD_VIEW,
    "/dashboard/students": PERMISSIONS.STUDENT_READ,
    "/dashboard/teachers": PERMISSIONS.TEACHER_READ,
    "/dashboard/users": PERMISSIONS.USER_READ,
    "/dashboard/violations": PERMISSIONS.VIOLATION_READ,
    "/dashboard/achievements": PERMISSIONS.ACHIEVEMENT_READ,
  } as const,

  api: {
    "/api/academic-years": {
      GET: PERMISSIONS.ACADEMIC_YEAR_READ,
      POST: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
      PUT: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
      DELETE: PERMISSIONS.ACADEMIC_YEAR_MANAGE,
    },

    "/api/rombels": {
      GET: PERMISSIONS.ROMBEL_READ,
      POST: PERMISSIONS.ROMBEL_MANAGE,
      PUT: PERMISSIONS.ROMBEL_MANAGE,
      DELETE: PERMISSIONS.ROMBEL_MANAGE,
    },

    "/api/religions": {
      GET: PERMISSIONS.RELIGION_READ,
      POST: PERMISSIONS.RELIGION_MANAGE,
      PUT: PERMISSIONS.RELIGION_MANAGE,
      DELETE: PERMISSIONS.RELIGION_MANAGE,
    },

    "/api/students": {
      GET: PERMISSIONS.STUDENT_READ,
      POST: PERMISSIONS.STUDENT_MANAGE,
      PUT: PERMISSIONS.STUDENT_MANAGE,
      DELETE: PERMISSIONS.STUDENT_MANAGE,
    },

    "/api/teachers": {
      GET: PERMISSIONS.TEACHER_READ,
      POST: PERMISSIONS.TEACHER_MANAGE,
      PUT: PERMISSIONS.TEACHER_MANAGE,
      DELETE: PERMISSIONS.TEACHER_MANAGE,
    },

    "/api/users": {
      GET: PERMISSIONS.USER_READ,
      POST: PERMISSIONS.USER_MANAGE,
      PUT: PERMISSIONS.USER_MANAGE,
      DELETE: PERMISSIONS.USER_MANAGE,
    },

    "/api/violations-master": {
      GET: PERMISSIONS.VIOLATION_READ,
      POST: PERMISSIONS.VIOLATION_MANAGE,
      PUT: PERMISSIONS.VIOLATION_MANAGE,
      DELETE: PERMISSIONS.VIOLATION_MANAGE,
    },

    "/api/achievements-master": {
      GET: PERMISSIONS.ACHIEVEMENT_READ,
      POST: PERMISSIONS.ACHIEVEMENT_MANAGE,
      PUT: PERMISSIONS.ACHIEVEMENT_MANAGE,
      DELETE: PERMISSIONS.ACHIEVEMENT_MANAGE,
    },

    "/api/auth": {
      POST: PERMISSIONS.DASHBOARD_VIEW,
    },
  } as const,

  fields: {
    student: {
      name: [PERMISSIONS.STUDENT_MANAGE],
      nis: [PERMISSIONS.STUDENT_MANAGE],
    },
    user: {
      role: [PERMISSIONS.USER_MANAGE],
      email: [PERMISSIONS.USER_MANAGE],
    },
  } as const,

  sidebar: [
    {
      label: "Dashboard",
      path: "/dashboard",
      permission: PERMISSIONS.DASHBOARD_VIEW,
    },

    // ================= MASTER DATA =================
    {
      label: "Master Akademik",
      children: [
        {
          label: "Tahun Ajaran",
          path: "/dashboard/academic-years",
          permission: PERMISSIONS.ACADEMIC_YEAR_READ,
        },
        {
          label: "Rombel",
          path: "/dashboard/rombels",
          permission: PERMISSIONS.ROMBEL_READ,
        },
        {
          label: "Agama",
          path: "/dashboard/religions",
          permission: PERMISSIONS.RELIGION_READ,
        },

        {
          label: "Aturan & Poin",
          path: "/dashboard/violations",
          permission: PERMISSIONS.VIOLATION_READ,
        },
      ],
    },

    {
      label: "Manajemen Pengguna",
      children: [
        {
          label: "Siswa",
          path: "/dashboard/students",
          permission: PERMISSIONS.STUDENT_READ,
        },
        {
          label: "Guru",
          path: "/dashboard/teachers",
          permission: PERMISSIONS.TEACHER_READ,
        },
        {
          label: "Users",
          path: "/dashboard/users",
          permission: PERMISSIONS.USER_READ,
        },
        {
          label: "Presensi Kehadiran",
          path: "/dashboard/attendances",
          permission: PERMISSIONS.ATTENDANCE_READ,
        },
      ],
    },

    {
      label: "Prestasi",
      path: "/dashboard/achievements",
      permission: PERMISSIONS.ACHIEVEMENT_READ,
    },

    // ===== Konseling BK =====
    {
      label: "Konseling BK",
      children: [
        {
          label: "Jadwal Konseling",
          path: "/dashboard/counseling-schedules",
          permission: PERMISSIONS.COUNSELING_READ,
        },
        {
          label: "Riwayat Konseling",
          path: "/dashboard/counselings",
          permission: PERMISSIONS.COUNSELING_READ,
        },
      ],
    },

    // ===== Proses Penanganan =====
    {
      label: "Penanganan",
      children: [
        {
          label: "Surat Peringatan",
          path: "/dashboard/warning-letters",
          permission: PERMISSIONS.WARNING_LETTER_READ,
        },
        {
          label: "Kunjungan Guru BK",
          path: "/dashboard/parent-home-visits",
          permission: PERMISSIONS.PARENT_CALL_READ,
        },
        {
          label: "Pemanggilan Orang Tua",
          path: "/dashboard/parent-calls",
          permission: PERMISSIONS.PARENT_CALL_READ,
        },
      ],
    },

    // ===== Monitoring & Laporan =====
    {
      label: "Monitoring & Laporan",
      children: [
        {
          label: "Rekap Pelanggaran",
          path: "/dashboard/reports/violations",
          permission: PERMISSIONS.REPORT_READ,
        },
        {
          label: "Rekap Prestasi",
          path: "/dashboard/reports/achievements",
          permission: PERMISSIONS.REPORT_READ,
        },
        {
          label: "Laporan Poin Siswa",
          path: "/dashboard/reports/student-points",
          permission: PERMISSIONS.REPORT_READ,
        },
      ],
    },
  ] as readonly SidebarNode[],
} as const;

/* ============================================================
   ROLE PERMISSION RESOLVER
============================================================ */

export function getRolePermissions(role: UserRole): Permission[] {
  const roleConfig = rbacConfig.roles[role];

  if (roleConfig === "ALL") {
    return Object.values(PERMISSIONS);
  }

  return roleConfig;
}
