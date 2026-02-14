// Files: src/shared-ui/component/ui/TextField.tsx
"use client";

import {
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

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode; // ✅ FIX: support JSX
  helperText?: string;
  variant?: Variant;
  size?: Size;
  error?: boolean;
  success?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  enablePasswordToggle?: boolean;
}

const sizeMap: Record<Size, string> = {
  lg: "h-12 text-base px-4",
  md: "h-10 text-sm px-3",
  sm: "h-8 text-xs px-2",
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
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType =
      enablePasswordToggle && isPassword
        ? showPassword
          ? "text"
          : "password"
        : type;

    const ToggleIcon = showPassword ? MdVisibilityOff : MdVisibility;

    return (
      <FormControl error={error} success={success} disabled={disabled}>
        {label && <FormLabel>{label}</FormLabel>}

        <div className="relative flex items-center">
          {LeftIcon && (
            <LeftIcon size={16} className="absolute left-3 text-gray-400" />
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={clsx(
              "w-full rounded-lg outline-none transition-all",
              "text-gray-800", // 🔥 warna text utama lebih tegas
              "placeholder:text-gray-600", // 🔥 placeholder lebih gelap
              "placeholder:opacity-100", // 🔥 hilangkan opacity default
              sizeMap[size],
              variantMap[variant],
              error && "border-red-500 focus:ring-2 focus:ring-red-200",
              success && "border-green-500 focus:ring-2 focus:ring-green-200",
              !error &&
                !success &&
                "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
              LeftIcon && "pl-9",
              (RightIcon || (enablePasswordToggle && isPassword)) && "pr-9",
              disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
              className,
            )}
            {...props}
          />

          {/* Password Toggle */}
          {enablePasswordToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <ToggleIcon size={18} />
            </button>
          )}

          {/* Custom Right Icon */}
          {!enablePasswordToggle && RightIcon && (
            <RightIcon size={16} className="absolute right-3 text-gray-400" />
          )}
        </div>

        {helperText && (
          <FormHelperText error={error} success={success}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
