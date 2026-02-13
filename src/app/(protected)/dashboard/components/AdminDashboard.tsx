//Files: src/app/(protected)/dashboard/components/AdminDashboard.tsx

import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { redirect } from "next/navigation";
import AdminDashboardPage from "@/sections/dashboard/pages/AdminPages";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <AdminDashboardPage user={user} />;
}