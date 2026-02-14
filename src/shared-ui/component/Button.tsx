// Files: src/shared-ui/component/Button.tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconType } from "react-icons";
import clsx from "clsx";

type Variant = "filled" | "label" | "outline" | "text";
type Size = "lg" | "md" | "sm";
type Shape = "rounded" | "circle";

type Color = "primary" | "secondary" | "error" | "warning" | "info" | "success";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: Color;
  leftIcon?: IconType;
  rightIcon?: IconType;
  loading?: boolean;
  iconOnly?: boolean;
  shape?: Shape;
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const sizeStyles: Record<Size, string> = {
  lg: "px-6 py-3 text-base",
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

const iconOnlySizeStyles: Record<Size, string> = {
  lg: "p-3",
  md: "p-2.5",
  sm: "p-2",
};

const iconSizeMap: Record<Size, number> = {
  lg: 18,
  md: 16,
  sm: 14,
};

const shapeStyles: Record<Shape, string> = {
  rounded: "rounded-lg",
  circle: "rounded-full aspect-square",
};

const colorMap: Record<Color, Record<Variant, string>> = {
  primary: {
    filled:
      "bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-400",
    label:
      "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 active:bg-indigo-300",
    outline:
      "border border-indigo-500 text-indigo-500 hover:bg-indigo-50 active:bg-indigo-100",
    text: "text-indigo-500 hover:bg-indigo-50 active:bg-indigo-100",
  },
  secondary: {
    filled:
      "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-400",
    label: "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400",
    outline:
      "border border-gray-500 text-gray-600 hover:bg-gray-100 active:bg-gray-200",
    text: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
  },
  error: {
    filled:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
    label: "bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300",
    outline:
      "border border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100",
    text: "text-red-500 hover:bg-red-50 active:bg-red-100",
  },
  warning: {
    filled:
      "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-400",
    label:
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:bg-yellow-300",
    outline:
      "border border-yellow-500 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100",
    text: "text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100",
  },
  info: {
    filled:
      "bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700 focus:ring-cyan-400",
    label: "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 active:bg-cyan-300",
    outline:
      "border border-cyan-500 text-cyan-500 hover:bg-cyan-50 active:bg-cyan-100",
    text: "text-cyan-500 hover:bg-cyan-50 active:bg-cyan-100",
  },
  success: {
    filled:
      "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-400",
    label: "bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300",
    outline:
      "border border-green-500 text-green-500 hover:bg-green-50 active:bg-green-100",
    text: "text-green-500 hover:bg-green-50 active:bg-green-100",
  },
};

export default function Button({
  children,
  variant = "filled",
  size = "md",
  color = "primary",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  iconOnly = false,
  shape = "rounded",
  fullWidth = false,
  className,
  disabled,
  type = "button", // ✅ default aman
  ...props
}: Props) {
  const isIconOnly = iconOnly || (!children && (LeftIcon || RightIcon));

  const iconSize = iconSizeMap[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        shapeStyles[shape],
        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
        colorMap[color][variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        <>
          {LeftIcon && <LeftIcon size={iconSize} />}
          {!isIconOnly && children}
          {RightIcon && <RightIcon size={iconSize} />}
        </>
      )}
    </button>
  );
}
