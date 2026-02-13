//Files: src/app/(protected)/dashboard/components/AdminDashboard.tsx


import type { CurrentUser } from "@/modules/auth/server/getCurrentUser";
import AdminDashboardPage from "@/sections/dashboard/pages/AdminPages";

interface Props {
    user: CurrentUser;
}

export default function AdminDashboard({ user }: Props) {
    return <AdminDashboardPage user={user} />;
}
