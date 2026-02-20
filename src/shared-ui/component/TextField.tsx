// Files: src/shared-ui/component/ui/TextField.tsx
"use client";

import React, {
    forwardRef,
    type InputHTMLAttributes,
    useState,
    type ReactNode,
} from "react";
import type { IconType } from "react-icons";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import clsx from "clsx";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormLabel from "@/shared-ui/component/Form/FormLabel";

type Variant = "outlined" | "filled" | "custom";
type Size = "lg" | "md" | "sm";

interface Props
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: ReactNode;
    helperText?: string;
    variant?: Variant;
    size?: Size;
    error?: boolean;
    success?: boolean;
    leftIcon?: IconType;
    rightIcon?: IconType;
    enablePasswordToggle?: boolean;

    // ✅ LENGTH VALIDATION
    maxLengthValue?: number;
    minLengthValue?: number;
    showCounter?: boolean;
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

const TextField = forwardRef<HTMLInputElement, Props>(
    (
        {
            label,
            helperText,
            variant = "outlined",
            size = "md",
            error,
            success,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            enablePasswordToggle,
            type = "text",
            disabled,
            className,
            maxLengthValue,
            minLengthValue,
            showCounter,
            onChange,
            value,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [internalError, setInternalError] = useState<string | null>(null);

        const isPassword = type === "password";

        const inputType =
            enablePasswordToggle && isPassword
                ? showPassword
                    ? "text"
                    : "password"
                : type;

        const ToggleIcon = showPassword
            ? MdVisibilityOff
            : MdVisibility;

        const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            const newValue = e.target.value;

            // 🔥 HARD STOP MAX LENGTH
            if (maxLengthValue && newValue.length > maxLengthValue) {
                return; // ⛔ hentikan input
            }

            // 🔥 OPTIONAL MIN LENGTH ERROR
            if (minLengthValue && newValue.length < minLengthValue) {
                setInternalError(`Minimal ${minLengthValue} karakter`);
            } else {
                setInternalError(null);
            }

            onChange?.(e);
        };


        const finalError = error || !!internalError;

        return (
            <FormControl
                error={finalError}
                success={success}
                disabled={disabled}
            >
                {label && <FormLabel>{label}</FormLabel>}

                <div className="relative flex items-center">
                    {LeftIcon && (
                        <LeftIcon
                            size={16}
                            className="absolute left-3 text-gray-400"
                        />
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        value={value}
                        onChange={handleChange}
                        maxLength={maxLengthValue}
                        className={clsx(
                            "w-full rounded-lg outline-none transition-all",
                            "text-gray-800",
                            "placeholder:text-gray-600",
                            "placeholder:opacity-100",
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
                            LeftIcon && "pl-9",
                            (RightIcon ||
                                (enablePasswordToggle && isPassword)) &&
                            "pr-9",
                            disabled &&
                            "bg-gray-100 text-gray-400 cursor-not-allowed",
                            className,
                        )}
                        {...props}
                    />

                    {/* Password Toggle */}
                    {enablePasswordToggle && isPassword && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            className="absolute right-3 text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                        >
                            <ToggleIcon size={18} />
                        </button>
                    )}

                    {/* Custom Right Icon */}
                    {!enablePasswordToggle && RightIcon && (
                        <RightIcon
                            size={16}
                            className="absolute right-3 text-gray-400"
                        />
                    )}
                </div>

                {/* Helper + Counter */}
                <div className="flex justify-between items-center">
                    {(helperText || internalError) && (
                        <FormHelperText
                            error={finalError}
                            success={success}
                        >
                            {internalError ?? helperText}
                        </FormHelperText>
                    )}

                    {showCounter && maxLengthValue && (
                        <span className="text-xs text-gray-400">
              {String(value ?? "").length} /{" "}
                            {maxLengthValue}
            </span>
                    )}
                </div>
            </FormControl>
        );
    },
);

TextField.displayName = "TextField";

export default TextField;

