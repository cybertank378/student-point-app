//Files : src/sections/auth/molecules/AuthField.tsx

import clsx from "clsx";
import type React from "react";
import { Label } from "@/shared-ui/component/Label";
import TextField from "@/shared-ui/component/TextField";

type InputType = "text" | "email" | "password" | "number";

type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: InputType;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    error?: string;
    touched?: boolean;
    showValid?: boolean;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
};

export const AuthField: React.FC<Props> = ({
                                               label,
                                               value,
                                               onChange,
                                               type = "text",
                                               placeholder,
                                               autoComplete,
                                               required,
                                               error,
                                               touched,
                                               showValid,
                                               rightIcon,
                                               onRightIconClick,
                                           }) => {
    const isError = Boolean(error && touched);
    const isValid = Boolean(showValid && !isError && value.length > 0);

    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-800">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </Label>

            <div className="relative">
                <TextField
                    type={type}
                    value={value}
                    inputMode={
                        type === "email"
                            ? "email"
                            : type === "number"
                                ? "numeric"
                                : undefined
                    }
                    onChange={(e) => {
                        const v = e.target.value;

                        // 🔒 optional guard: number only
                        if (type === "number" && !/^\d*$/.test(v)) {
                            return;
                        }

                        onChange(v);
                    }}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={clsx(
                        "rounded-xl pr-9",
                        isError && "border-red-400 focus:border-red-500",
                        !isError &&
                        isValid &&
                        "border-emerald-500 focus:border-emerald-500",
                        !isError && !isValid && "focus:border-emerald-500",
                    )}
                />

                {(rightIcon || isValid) && (
                    <button
                        type="button"
                        onClick={onRightIconClick}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-2 flex items-center justify-center rounded-full px-1 hover:bg-gray-50"
                    >
                        {rightIcon ??
                            (isValid && (
                                <svg
                                    className="h-4 w-4 text-emerald-500"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M16.667 5L8.125 13.542 4 9.417"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ))}
                    </button>
                )}
            </div>

            {isError && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default AuthField;
