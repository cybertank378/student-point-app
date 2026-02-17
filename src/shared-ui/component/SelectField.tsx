"use client";

import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormLabel from "@/shared-ui/component/Form/FormLabel";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";

type Variant = "outlined" | "filled" | "custom";
type Size = "lg" | "md" | "sm";

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label?: string;
    helperText?: string;
    variant?: Variant;
    size?: Size;
    error?: boolean;
    success?: boolean;
    className?: string;
    wrapperClassName?: string;
}

const sizeMap: Record<Size, string> = {
    lg: "h-12 text-base px-4",
    md: "h-11 text-sm px-3", // 🔥 44px (match TextField)
    sm: "h-9 text-xs px-2",
};

const variantMap: Record<Variant, string> = {
    outlined: "border bg-white",
    filled: "bg-gray-100 border border-transparent",
    custom: "border rounded-xl bg-white",
};

export default function SelectField({
                                        label,
                                        helperText,
                                        variant = "outlined",
                                        size = "md",
                                        error,
                                        success,
                                        className,
                                        wrapperClassName,
                                        children,
                                        disabled,
                                        ...props
                                    }: Props) {
    return (
        <FormControl
            error={error}
            success={success}
            disabled={disabled}
            className={wrapperClassName}
        >
            {label && <FormLabel>{label}</FormLabel>}

            <div className="relative">
                <select
                    disabled={disabled}
                    className={clsx(
                        "w-full rounded-lg outline-none transition-all appearance-none",
                        "text-gray-800",
                        sizeMap[size],
                        variantMap[variant],
                        error && "border-red-500 focus:ring-2 focus:ring-red-200",
                        success && "border-green-500 focus:ring-2 focus:ring-green-200",
                        !error &&
                        !success &&
                        "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                        "pr-10", // space for chevron
                        disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </select>

                {/* Custom Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaChevronDown size={16} />
                </div>
            </div>

            {helperText && (
                <FormHelperText error={error} success={success}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}
