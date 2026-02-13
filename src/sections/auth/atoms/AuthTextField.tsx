//File :src/sections/auth/atoms/AuthTextField.tsx
"use client";

import type React from "react";
import { MdCheckCircle } from "react-icons/md";
import TextField from "@/shared-ui/component/TextField";

type Props = {
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    onChangeAction: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    error?: string;
    touched?: boolean;
    showValid?: boolean;
};

export const AuthTextField: React.FC<Props> = ({
                                                   label,
                                                   type = "text",
                                                   value,
                                                   onChangeAction,
                                                   placeholder,
                                                   autoComplete,
                                                   required,
                                                   error,
                                                   touched,
                                                   showValid,
                                               }) => {
    const isError = Boolean(error && touched);
    const isValid = Boolean(showValid && !isError && value.length > 0);

    return (
        <TextField
            label={
                required ? (
                    <>
                        {label}
                        <span className="text-red-500"> *</span>
                    </>
                ) : (
                    label
                )
            }
            type={type}
            value={value}
            onChange={(e) => onChangeAction(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            variant="custom"
            size="lg"
            error={isError}
            success={isValid}
            helperText={isError ? error : undefined}
            enablePasswordToggle={type === "password"}
            rightIcon={isValid ? MdCheckCircle : undefined}
        />
    );
};

export default AuthTextField;

