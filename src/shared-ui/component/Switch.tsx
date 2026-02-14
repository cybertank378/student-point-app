//Files: src/shared-ui/component/Switch.tsx
"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: "peer-checked:bg-indigo-600 peer-focus:ring-indigo-300",
  secondary: "peer-checked:bg-gray-600 peer-focus:ring-gray-300",
  error: "peer-checked:bg-red-500 peer-focus:ring-red-300",
  warning: "peer-checked:bg-amber-500 peer-focus:ring-amber-300",
  info: "peer-checked:bg-cyan-500 peer-focus:ring-cyan-300",
  success: "peer-checked:bg-lime-500 peer-focus:ring-lime-300",
};

const Switch = forwardRef<HTMLInputElement, Props>(
  ({ label, disabled, variant = "primary", className, ...props }, ref) => {
    return (
      <label
        className={clsx(
          "inline-flex items-center gap-3 select-none",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        <span className="relative inline-block w-11 h-6">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          {/* Track */}
          <span
            className={clsx(
              "absolute inset-0 rounded-full bg-gray-300 transition-all",
              "peer-focus:ring-2",
              variantStyles[variant],
            )}
          />

          {/* Thumb */}
          <span
            className={clsx(
              "absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all",
              "peer-checked:translate-x-5",
            )}
          />
        </span>

        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
