//Files: src/app/(protected)/dashboard/components/TeacherDashboard.tsx

import { getCurrentUser} from "@/modules/auth/server/getCurrentUser";
import {redirect} from "next/navigation";

export default async function TeacherDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">
                    Dashboard Guru
                </h1>
                <p className="text-gray-500">
                    Selamat datang, {user.username}
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatCard title="Siswa Kelas" value="32" />
                <StatCard title="Pelanggaran Hari Ini" value="3" />
            </div>
        </div>
    );
}

function StatCard({
                      title,
                      value,
                  }: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
                {title}
            </p>
            <h2 className="text-2xl font-bold">
                {value}
            </h2>
        </div>
    );
}
