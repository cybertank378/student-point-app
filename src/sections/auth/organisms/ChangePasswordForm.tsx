//Files: src/sections/auth/organisms/ChangePasswordForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import Button from "@/shared-ui/component/Button";
import {
    showErrorToast,
    showSuccessToast,
} from "@/shared-ui/component/Toast";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";

/* =====================================================
 * PASSWORD STRENGTH UTILITY
 ===================================================== */

type StrengthLevel =
    | "weak"
    | "medium"
    | "strong"
    | "very-strong";

interface PasswordStrength {
    score: number;
    level: StrengthLevel;
    checks: {
        length: boolean;
        lowercase: boolean;
        uppercase: boolean;
        number: boolean;
        symbol: boolean;
    };
}

const getPasswordStrength = (
    password: string
): PasswordStrength => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean)
        .length;

    let level: StrengthLevel = "weak";

    if (score >= 5) level = "very-strong";
    else if (score === 4) level = "strong";
    else if (score === 3) level = "medium";

    return { score, level, checks };
};

/* =====================================================
 * VALIDATION
 ===================================================== */

const validateOldPassword = (value: string) => {
    if (!value) return "Password lama wajib diisi";
    return "";
};

const validateNewPassword = (value: string) => {
    if (!value) return "Password baru wajib diisi";
    if (value.length < 8)
        return "Minimal 8 karakter";
    return "";
};

const validateConfirmPassword = (
    newPassword: string,
    confirmPassword: string
) => {
    if (!confirmPassword)
        return "Konfirmasi password wajib diisi";

    if (newPassword !== confirmPassword)
        return "Password baru tidak sama";

    return "";
};

/* =====================================================
 * COMPONENT
 ===================================================== */

export default function ChangePasswordForm() {
    const router = useRouter();
    const { changePassword, loading, error } =
        useAuthApi();

    const [oldPassword, setOldPassword] =
        useState("");
    const [newPassword, setNewPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [submitted, setSubmitted] =
        useState(false);

    const strength = getPasswordStrength(
        newPassword
    );

    const oldPasswordError = submitted
        ? validateOldPassword(oldPassword)
        : "";

    const newPasswordError = submitted
        ? validateNewPassword(newPassword)
        : "";

    const confirmPasswordError = submitted
        ? validateConfirmPassword(
            newPassword,
            confirmPassword
        )
        : "";

    const isValid =
        !validateOldPassword(oldPassword) &&
        !validateNewPassword(newPassword) &&
        !validateConfirmPassword(
            newPassword,
            confirmPassword
        ) &&
        strength.score >= 3; // minimal medium

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setSubmitted(true);

        if (!isValid) {
            showErrorToast(
                "Silakan periksa kembali data Anda."
            );
            return;
        }

        try {
            await changePassword(
                oldPassword,
                newPassword
            );

            showSuccessToast(
                "Password berhasil diperbarui."
            );

            router.replace("/dashboard");
        } catch {
            showErrorToast(
                error?.message ??
                "Gagal mengubah password."
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-6"
        >

            {/* PASSWORD LAMA */}
            <AuthTextField
                label="Password Lama"
                type="password"
                value={oldPassword}
                onChangeAction={setOldPassword}
                placeholder="Masukkan password lama"
                required
                error={oldPasswordError}
                touched={submitted}
            />

            {/* PASSWORD BARU */}
            <AuthTextField
                label="Password Baru"
                type="password"
                value={newPassword}
                onChangeAction={setNewPassword}
                placeholder="Minimal 8 karakter"
                required
                error={newPasswordError}
                touched={submitted}
            />

            {/* PASSWORD STRENGTH */}
            {newPassword.length > 0 && (
                <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                                strength.level === "weak"
                                    ? "w-1/4 bg-red-500"
                                    : strength.level ===
                                    "medium"
                                        ? "w-2/4 bg-yellow-500"
                                        : strength.level ===
                                        "strong"
                                            ? "w-3/4 bg-emerald-500"
                                            : "w-full bg-green-600"
                            }`}
                        />
                    </div>

                    <p
                        className={`text-xs font-medium ${
                            strength.level === "weak"
                                ? "text-red-500"
                                : strength.level ===
                                "medium"
                                    ? "text-yellow-500"
                                    : strength.level ===
                                    "strong"
                                        ? "text-emerald-600"
                                        : "text-green-700"
                        }`}
                    >
                        Kekuatan Password:{" "}
                        {strength.level === "weak"
                            ? "Lemah"
                            : strength.level ===
                            "medium"
                                ? "Sedang"
                                : strength.level ===
                                "strong"
                                    ? "Kuat"
                                    : "Sangat Kuat"}
                    </p>

                    <ul className="space-y-1 text-xs text-gray-600">
                        <li
                            className={
                                strength.checks.length
                                    ? "text-emerald-600"
                                    : ""
                            }
                        >
                            ✓ Minimal 8 karakter
                        </li>
                        <li
                            className={
                                strength.checks.lowercase
                                    ? "text-emerald-600"
                                    : ""
                            }
                        >
                            ✓ Huruf kecil
                        </li>
                        <li
                            className={
                                strength.checks.uppercase
                                    ? "text-emerald-600"
                                    : ""
                            }
                        >
                            ✓ Huruf besar
                        </li>
                        <li
                            className={
                                strength.checks.number
                                    ? "text-emerald-600"
                                    : ""
                            }
                        >
                            ✓ Angka
                        </li>
                        <li
                            className={
                                strength.checks.symbol
                                    ? "text-emerald-600"
                                    : ""
                            }
                        >
                            ✓ Simbol
                        </li>
                    </ul>
                </div>
            )}

            {/* KONFIRMASI PASSWORD */}
            <AuthTextField
                label="Konfirmasi Password Baru"
                type="password"
                value={confirmPassword}
                onChangeAction={setConfirmPassword}
                placeholder="Ulangi password baru"
                required
                error={confirmPasswordError}
                touched={submitted}
            />

            <Button
                type="submit"
                variant="filled"
                color="primary"
                size="lg"
                loading={loading}
                disabled={!isValid || loading}
                className="w-full rounded-xl"
            >
                Perbarui Password
            </Button>
        </form>
    );
}