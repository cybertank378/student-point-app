//Files: src/sections/dashboard/pages/AdminPages.tsx
"use client";

import type {CurrentUser} from "@/modules/auth/server/getCurrentUser";
import {MdEmojiEvents, MdGavel, MdSchool, MdWarning,} from "react-icons/md";

import {useEffect, useState} from "react";

import {KPICard} from "@/sections/dashboard/atomic/KPICard";
import ViolationChart from "@/sections/dashboard/atomic/ViolationChart";
import AttendanceChart from "@/sections/dashboard/atomic/AttendanceChart";


import StudentViolationTable from "@/sections/dashboard/molecules/StudentViolationTable";
import FollowUpCard from "@/sections/dashboard/atomic/FollowUpCard";



interface Props {
    user: CurrentUser;
}

export default function AdminDashboardPage({user}: Props) {




    return (
        <div className="min-h-screen bg-gray-100 p-6 space-y-6">

            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Dashboard Admin
                </h1>
                <p className="text-sm text-gray-500">
                    Selamat datang kembali, {user.username}
                </p>
            </div>

            {/* ================= KPI CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <KPICard
                    title="Total Siswa"
                    value="842"
                    percent="+12.4%"
                    accent="indigo"
                    icon={<MdSchool size={20}/>}
                />
                <KPICard
                    title="Pelanggaran"
                    value="134"
                    percent="-8.7%"
                    accent="amber"
                    icon={<MdGavel size={20}/>}
                />
                <KPICard
                    title="Prestasi"
                    value="27"
                    percent="+4.3%"
                    accent="rose"
                    icon={<MdEmojiEvents size={20}/>}
                />
                <KPICard
                    title="SP2 & SP3"
                    value="12"
                    percent="-2.5%"
                    accent="sky"
                    icon={<MdWarning size={20}/>}
                />
            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ViolationChart/>
                <AttendanceChart/>
            </div>

            {/* ================= ROW 3 ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Ringkasan */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Ringkasan Bulan Ini
                    </h3>

                    <div className="space-y-4 text-sm">
                        <SummaryItem label="Pelanggaran Aktif" value="89" positive/>
                        <SummaryItem label="SP1 Dikeluarkan" value="24"/>
                        <SummaryItem label="SP2 Dikeluarkan" value="10"/>
                        <SummaryItem label="SP3 Dikeluarkan" value="2" negative/>
                    </div>
                </div>

                {/* DONUT TINDAK LANJUT */}
                <FollowUpCard />


                {/* Aktivitas */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Aktivitas Terbaru
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <p>Ahmad Fauzi menerima SP1</p>
                        <p>Siti Nurhaliza menerima SP2</p>
                        <p>Data pelanggaran diperbarui</p>
                    </div>
                </div>
            </div>

            {/* ================= TABLE ================= */}

            <StudentViolationTable />

        </div>
    );
}

/* ================= COMPONENTS ================= */

function SummaryItem({
                         label,
                         value,
                         positive,
                         negative,
                     }: {
    label: string;
    value: string;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span
                className={`font-medium ${
                    positive
                        ? "text-green-600"
                        : negative
                            ? "text-red-600"
                            : "text-gray-800"
                }`}
            >
        {value}
      </span>
        </div>
    );
}
