"use client";

import {FaUserFriends, FaUserGraduate, FaUsers, FaUserShield, FaUserTie,} from "react-icons/fa";

import type {useUserApi} from "@/modules/user/presentation/hooks/useUserApi";
import {UserStatCard} from "../atomic/UserStatCard";

interface Props {
    api: ReturnType<typeof useUserApi>;
}

export default function UserStat({api}: Props) {
    const {stats} = api;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            <UserStatCard
                title="Active Users"
                value={stats?.totalActiveUsers ?? 0}
                icon={<FaUsers size={20}/>}
                accent="emerald"
                subtitle="User aktif di sistem"
            />


            <UserStatCard
                title="Students"
                value={stats?.totalStudentUsers ?? 0}
                icon={<FaUserGraduate size={20}/>}
                accent="sky"
                subtitle="Total siswa"
            />

            <UserStatCard
                title="Parents"
                value={stats?.totalParentUsers ?? 0}
                icon={<FaUserFriends size={20}/>}
                accent="amber"
                subtitle="Orang tua siswa"
            />

            <UserStatCard
                title="Teachers"
                value={stats?.totalTeacherUsers ?? 0}
                icon={<FaUserTie size={20}/>}
                accent="rose"
                subtitle="Tenaga pengajar"
            />
        </div>
    );
}

