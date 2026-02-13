//Files: src/shared-ui/component/Switch.tsx

"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

const Switch = forwardRef<HTMLInputElement, Props>(
    ({ label, disabled, ...props }, ref) => {
        return (
            <label className="inline-flex items-center gap-3 cursor-pointer">
        <span className="relative">
          <input
              ref={ref}
              type="checkbox"
              role="switch"
              disabled={disabled}
              className="peer sr-only"
              {...props}
          />

          <span
              className={clsx(
                  "w-11 h-6 bg-gray-300 rounded-full transition-all",
                  "peer-checked:bg-indigo-600",
                  "peer-focus:ring-2 peer-focus:ring-indigo-300",
                  disabled && "opacity-50"
              )}
          />

          <span
              className={clsx(
                  "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all",
                  "peer-checked:translate-x-5"
              )}
          />
        </span>

                {label && (
                    <span className="text-sm text-gray-700">
            {label}
          </span>
                )}
            </label>
        );
    }
);

Switch.displayName = "Switch";
export default Switch;
