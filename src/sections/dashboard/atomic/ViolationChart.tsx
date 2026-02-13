//Files: src/sections/dashboard/atomic/ViolationChart.tsx
"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function ViolationChart() {
    /* ================= DATA DUMMY ================= */

    const monthlyData = [
        { month: "Jan", pelanggaran: 40, selesai: 28 },
        { month: "Feb", pelanggaran: 55, selesai: 42 },
        { month: "Mar", pelanggaran: 32, selesai: 25 },
        { month: "Apr", pelanggaran: 60, selesai: 48 },
        { month: "Mei", pelanggaran: 48, selesai: 38 },
    ];

    /* ================= HITUNG TOTAL ================= */

    const summary = useMemo(() => {
        const totalPelanggaran = monthlyData.reduce(
            (acc, item) => acc + item.pelanggaran,
            0
        );

        const totalSelesai = monthlyData.reduce(
            (acc, item) => acc + item.selesai,
            0
        );

        const persentase =
            totalPelanggaran > 0
                ? Math.round((totalSelesai / totalPelanggaran) * 100)
                : 0;

        return {
            totalPelanggaran,
            totalSelesai,
            persentase,
        };
    }, []);

    /* ================= SERIES ================= */

    const series = [
        {
            name: "Jumlah Pelanggaran",
            type: "column" as const,
            data: monthlyData.map((item) => item.pelanggaran),
        },
        {
            name: "Terselesaikan",
            type: "area" as const,
            data: monthlyData.map((item) => item.selesai),
        },
    ];

    /* ================= OPTIONS ================= */

    const options: ApexOptions = {
        chart: {
            type: "line",
            stacked: false,
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        stroke: {
            curve: "smooth",
            width: [0, 3],
        },
        plotOptions: {
            bar: {
                columnWidth: "45%",
                borderRadius: 6,
            },
        },
        fill: {
            opacity: [0.85, 0.25],
        },
        colors: ["#6366f1", "#22c55e"],
        xaxis: {
            categories: monthlyData.map((item) => item.month),
        },
        yaxis: {
            min: 0,
            forceNiceScale: true,
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 5,
        },
        dataLabels: {
            enabled: false,
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* HEADER */}
            <h3 className="font-semibold text-gray-700 mb-4">
                Statistik Pelanggaran
            </h3>

            {/* CHART */}
            <Chart options={options} series={series} type="line" height={280} />

            {/* SUMMARY */}
            {/* SUMMARY */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-10 text-sm">

                <div className="text-gray-600">
                    Penyelesaian:{" "}
                    <span className="font-semibold text-green-600"> {summary.persentase}%</span>
                </div>

                <div>
                    <span className="text-gray-500">Total Pelanggaran:</span>{" "}
                    <span className="font-semibold text-indigo-600">{summary.totalPelanggaran}</span>
                </div>

                <div>
                    <span className="text-gray-500">Terselesaikan:</span>{" "}
                    <span className="font-semibold text-green-600">{summary.totalSelesai}</span>
                </div>

            </div>

        </div>
    );

}
