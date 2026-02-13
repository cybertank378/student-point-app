//Files: src/sections/dashboard/atomic/KPICard.tsx

import React from "react";

export type Accent = "indigo" | "amber" | "rose" | "sky";

interface KPICardProps {
    title: string;
    value: string;
    percent: string;
    icon: React.ReactNode;
    accent: Accent;
}

interface AccentStyle {
    iconBg: string;
    border: string;
}

const accentMap: Record<Accent, AccentStyle> = {
    indigo: {
        iconBg: "bg-indigo-100 text-indigo-600",
        border: "after:bg-indigo-500",
    },
    amber: {
        iconBg: "bg-amber-100 text-amber-600",
        border: "after:bg-amber-500",
    },
    rose: {
        iconBg: "bg-rose-100 text-rose-600",
        border: "after:bg-rose-500",
    },
    sky: {
        iconBg: "bg-sky-100 text-sky-600",
        border: "after:bg-sky-500",
    },
};

export function KPICard({
                            title,
                            value,
                            percent,
                            icon,
                            accent,
                        }: KPICardProps) {
    const isPositive = percent.startsWith("+");

    return (
        <div
            className={`
        w-full
        relative bg-white rounded-2xl p-6
        shadow-[0_6px_20px_rgba(0,0,0,0.04)]
        border border-gray-100
        after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full
        after:rounded-b-2xl
        ${accentMap[accent].border}
      `}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`w-11 h-11 flex items-center justify-center rounded-xl ${accentMap[accent].iconBg}`}
                >
                    {icon}
                </div>

                <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-800">
                        {value}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-600">{title}</p>

                <div className="mt-1 flex items-center text-xs">
          <span
              className={`font-medium ${
                  isPositive ? "text-green-600" : "text-red-500"
              }`}
          >
            {percent} <span className="text-gray-400 ml-3">dibanding minggu lalu</span>
          </span>

                </div>
            </div>
        </div>
    );
}

