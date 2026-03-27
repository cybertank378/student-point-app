//Files: src/sections/student/atomic/ViolationTrendChart.tsx
"use client";

import type ApexCharts from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: {
    month: number;
    monthLabel: string;
    totalViolations: number;
  }[];
};

export default function ViolationTrendChart({ data }: Props) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: { show: false },
    },

    colors: ["#ef4444"],

    stroke: {
      width: 3,
      curve: "smooth",
    },

    xaxis: {
      categories: data.map((d) => d.monthLabel),
    },

    grid: {
      borderColor: "#f1f5f9",
    },
  };

  const series = [
    {
      name: "Pelanggaran",
      data: data.map((d) => d.totalViolations),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-70">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Trends Pelanggaran</h3>
      </div>

      <Chart type="line" height={200} options={options} series={series} />
    </div>
  );
}
