"use client";

import { useEffect, useState } from "react";
import type React from "react";

export type Accent = "indigo" | "emerald" | "amber" | "rose" | "sky";

interface UserStatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    accent: Accent;
    subtitle?: string;
}

interface AccentStyle {
    iconBg: string;
    gradient: string;
}

const accentMap: Record<Accent, AccentStyle> = {
    indigo: {
        iconBg: "bg-indigo-100 text-indigo-600",
        gradient: "from-indigo-500/10 to-indigo-500/5",
    },
    emerald: {
        iconBg: "bg-emerald-100 text-emerald-600",
        gradient: "from-emerald-500/10 to-emerald-500/5",
    },
    amber: {
        iconBg: "bg-amber-100 text-amber-600",
        gradient: "from-amber-500/10 to-amber-500/5",
    },
    rose: {
        iconBg: "bg-rose-100 text-rose-600",
        gradient: "from-rose-500/10 to-rose-500/5",
    },
    sky: {
        iconBg: "bg-sky-100 text-sky-600",
        gradient: "from-sky-500/10 to-sky-500/5",
    },
};

export function UserStatCard({
                                 title,
                                 value,
                                 icon,
                                 accent,
                                 subtitle,
                             }: UserStatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);

    // ✨ Smooth Count Up Animation
    useEffect(() => {
        let start = 0;
        const duration = 600;
        const increment = value / (duration / 16);

        const counter = setInterval(() => {
            start += increment;
            if (start >= value) {
                setDisplayValue(value);
                clearInterval(counter);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(counter);
    }, [value]);

    return (
        <div
            className={`
        w-full
        bg-gradient-to-br ${accentMap[accent].gradient}
        border border-gray-200
        rounded-xl
        px-4 py-4
        transition-all
        hover:shadow-sm
      `}
        >
            <div className="flex items-center justify-between">
                {/* LEFT */}
                <div>
                    <p className="text-xs font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-gray-800">
                        {displayValue}
                    </p>

                    {subtitle && (
                        <p className="mt-0.5 text-[11px] text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* RIGHT ICON */}
                <div
                    className={`
            w-10 h-10
            rounded-lg
            flex items-center justify-center
            ${accentMap[accent].iconBg}
          `}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
