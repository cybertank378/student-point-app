//Files: src/app/(protected)/dashboard/page.tsx

import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import AdminDashboard from "@/app/(protected)/dashboard/components/AdminDashboard";
import TeacherDashboard from "@/app/(protected)/dashboard/components/TeacherDashboard";
import StudentDashboard from "@/app/(protected)/dashboard/components/StudentDashboard";
import ParentDashboard from "@/app/(protected)/dashboard/components/ParentDashboard";

const DASHBOARD_MAP = {
    ADMIN: AdminDashboard,
    TEACHER: TeacherDashboard,
    STUDENT: StudentDashboard,
    PARENT: ParentDashboard,
} as const;

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const Component = DASHBOARD_MAP[user.role];

    return <Component user={user} />;
}