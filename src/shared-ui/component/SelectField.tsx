//Files: src/shared-ui/component/SelectField.tsx

"use client";

import { SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormLabel from "@/shared-ui/component/Form/FormLabel";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    className?: string;
    wrapperClassName?: string;
}

export default function SelectField({
                                        label,
                                        helperText,
                                        error,
                                        className,
                                        wrapperClassName,
                                        children,
                                        ...props
                                    }: Props) {
    return (
        <FormControl
            error={error}
            className={wrapperClassName}
        >
            {label && (
                <FormLabel className="text-sm font-medium text-gray-800 mb-1">
                    {label}
                </FormLabel>
            )}

            <div className="relative w-full">
                <select
                    className={clsx(
                        "h-10 w-full px-3 pr-10 text-sm rounded-lg outline-none transition-all duration-200",
                        "bg-white text-gray-800",
                        "border border-gray-300 shadow-sm",
                        "appearance-none bg-none", // 🔥 remove default arrow
                        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                        "hover:border-gray-400",
                        error &&
                        "border-red-500 focus:ring-red-200 focus:border-red-500",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>

                {/* Custom Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaChevronDown size={12} />
                </div>
            </div>

            {helperText && (
                <FormHelperText error={error}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}
