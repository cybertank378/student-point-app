//Files: src/sections/student/atomic/AcademicPerformanceChart.tsx
"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type MonthlyViolationByGradeItem = {
  month: number;
  monthLabel: string;
  grade7: number;
  grade8: number;
  grade9: number;
};

type Props = {
  data: MonthlyViolationByGradeItem[];
};

export default function AcademicPerformanceChart({ data }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 220,
      toolbar: { show: false },
      fontFamily: "inherit",
      stacked: false,
    },

    colors: ["#1e3a5f", "#64748b", "#c084fc"],

    xaxis: {
      categories: data.map((d) => d.monthLabel),
      axisBorder: { show: true },
      axisTicks: { show: true },
    },

    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    legend: {
      position: "top",
      horizontalAlign: "center",
    },

    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: {
        left: 20,
        right: 20,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%", // lebih kecil agar ada space
        borderRadius: 6,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },

    dataLabels: {
      enabled: false,
    },

    fill: {
      opacity: 1,
    },

    yaxis: {
      title: {
        text: "Total Pelanggaran",
      },
    },

    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} pelanggaran`,
      },
    },
  };

  const series = [
    {
      name: "Kelas VII",
      data: data.map((d) => d.grade7),
    },
    {
      name: "Kelas VIII",
      data: data.map((d) => d.grade8),
    },
    {
      name: "Kelas IX",
      data: data.map((d) => d.grade9),
    },
  ];

  return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-70">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-slate-700">
            Statistik Pelanggaran Bulanan per Kelas
          </h3>
        </div>

        <Chart type="bar" height={220} options={options} series={series} />
      </div>
  );
}