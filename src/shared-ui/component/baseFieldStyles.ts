//Files: src/shared-ui/component/baseFieldStyles.ts

import clsx from "clsx";

export type FieldSize = "sm" | "md" | "lg";

export const fieldSizeMap: Record<FieldSize, string> = {
    sm: "h-9 text-sm px-2",
    md: "h-11 text-sm px-3", // 🔥 44px default
    lg: "h-12 text-base px-4",
};

export const baseFieldClass = (
    size: FieldSize = "md",
    error?: boolean,
    success?: boolean,
    disabled?: boolean,
) =>
    clsx(
        "w-full rounded-lg border transition-all outline-none",
        "bg-white",
        fieldSizeMap[size],
        error && "border-red-500 focus:ring-2 focus:ring-red-200",
        success && "border-green-500 focus:ring-2 focus:ring-green-200",
        !error &&
        !success &&
        "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
        disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
    );
