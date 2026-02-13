//Files: src/sections/dashboard/atomic/AttendanceChart.tsx
"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import SelectField from "@/shared-ui/component/SelectField";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function AttendanceChart() {

    /* ================= 12 BULAN OTOMATIS ================= */

    const bulanList = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("id-ID", { month: "long" })
    );

    const currentMonthIndex = new Date().getMonth();

    const [selectedBulan, setSelectedBulan] = useState<string>(
        bulanList[currentMonthIndex]
    );

    /* ================= DUMMY DATA ================= */

    const attendanceSeries = [
        {
            name: "Hadir",
            type: "column" as const,
            data: [92, 88, 95, 90],
        },
        {
            name: "Izin",
            type: "area" as const,
            data: [5, 7, 3, 6],
        },
        {
            name: "Alfa",
            type: "line" as const,
            data: [3, 5, 2, 4],
        },
    ];

    /* ================= OPTIONS ================= */

    const options: ApexOptions = {
        chart: {
            type: "line",
            stacked: false,
            toolbar: { show: false },
            fontFamily: "inherit",
            parentHeightOffset: 0,
        },

        stroke: {
            width: [0, 3, 3],
            curve: "smooth",
        },

        plotOptions: {
            bar: {
                columnWidth: "35%",
                borderRadius: 6,
            },
        },

        markers: {
            size: 0,
        },

        colors: ["#4f46e5", "#22c55e", "#ef4444"],

        fill: {
            opacity: [0.9, 0.25, 1],
        },

        xaxis: {
            categories: ["7A", "7B", "8A", "8B"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },

        yaxis: [
            {
                min: 0,
                max: 100,
                tickAmount: 5,
                title: { text: "Hadir (%)" },
                labels: {
                    formatter: (val: number) => `${val}%`,
                },
            },
            {
                opposite: true,
                min: 0,
                max: 20,
                tickAmount: 4,
                title: { text: "Izin / Alfa (%)" },
                labels: {
                    formatter: (val: number) => `${val}%`,
                },
            },
        ],

        legend: {
            show: false,
        },

        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (val: number) => `${val}%`,
            },
        },

        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 6,
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">
                    Statistik Kehadiran Siswa
                </h3>

                <SelectField
                    value={selectedBulan}
                    onChange={(e) => setSelectedBulan(e.target.value)}
                    className="h-9 px-3 py-1 text-sm min-w-[50px]"
                >
                    {bulanList.map((bulan) => (
                        <option key={bulan} value={bulan}>
                            {bulan}
                        </option>
                    ))}
                </SelectField>
            </div>

            <Chart options={options} series={attendanceSeries} type="line" height={320} />

            {/* Custom Legend */}
            <div className="flex justify-center gap-6 mt-4">
                <LegendItem color="bg-indigo-600" label="Hadir" />
                <LegendItem color="bg-green-500" label="Izin" />
                <LegendItem color="bg-red-500" label="Alfa" />
            </div>
        </div>
    );
}

/* ================= LEGEND ITEM ================= */

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-sm text-gray-700">{label}</span>
        </div>
    );
}
