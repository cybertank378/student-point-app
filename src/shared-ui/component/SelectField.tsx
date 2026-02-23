//Files: src/shared-ui/component/SelectField.tsx

"use client";

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormLabel from "@/shared-ui/component/Form/FormLabel";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";

type Variant = "outlined" | "filled" | "custom";
type Size = "lg" | "md" | "sm";

interface Props
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label?: ReactNode;
    helperText?: string;
    variant?: Variant;
    size?: Size;

    // ✅ Sama seperti TextField
    error?: boolean | string;

    success?: boolean;
    className?: string;
    wrapperClassName?: string;
}

const sizeMap: Record<Size, string> = {
    lg: "h-12 text-base px-4",
    md: "h-11 text-sm px-3",
    sm: "h-9 text-xs px-2",
};

const variantMap: Record<Variant, string> = {
    outlined: "border bg-white",
    filled: "bg-gray-100 border border-transparent",
    custom: "border rounded-xl bg-white",
};

const SelectField = forwardRef<HTMLSelectElement, Props>(
    (
        {
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
            name,
            ...props
        },
        ref,
    ) => {
        // 🔥 HANDLE STRING ERROR
        const externalErrorMessage =
            typeof error === "string" ? error : null;

        const externalErrorBoolean =
            typeof error === "boolean" ? error : !!externalErrorMessage;

        const finalError = externalErrorBoolean;

        const finalMessage = externalErrorMessage ?? null;

        return (
            <FormControl
                error={finalError}
                success={success}
                disabled={disabled}
                className={wrapperClassName}
            >
                {label && <FormLabel>{label}</FormLabel>}

                <div className="relative">
                    <select
                        ref={ref}
                        name={name}
                        data-field={name}
                        disabled={disabled}
                        className={clsx(
                            "w-full rounded-lg outline-none transition-all appearance-none",
                            "text-gray-800",
                            sizeMap[size],
                            variantMap[variant],
                            finalError &&
                            "border-red-500 focus:ring-2 focus:ring-red-200",
                            success &&
                            !finalError &&
                            "border-green-500 focus:ring-2 focus:ring-green-200",
                            !finalError &&
                            !success &&
                            "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                            "pr-10",
                            disabled &&
                            "bg-gray-100 text-gray-400 cursor-not-allowed",
                            className,
                        )}
                        {...props}
                    >
                        {children}
                    </select>

                    {/* Chevron */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <FaChevronDown size={16} />
                    </div>
                </div>

                {/* 🔥 ERROR / HELPER SECTION */}
                <div className="mt-1 space-y-1">
                    {finalMessage && (
                        <FormHelperText error>
                            {finalMessage}
                        </FormHelperText>
                    )}

                    {!finalMessage && helperText && (
                        <FormHelperText success={success}>
                            {helperText}
                        </FormHelperText>
                    )}
                </div>
            </FormControl>
        );
    },
);

SelectField.displayName = "SelectField";
export default SelectField;