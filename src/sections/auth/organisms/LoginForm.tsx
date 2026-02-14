//Files: src/sections/auth/organisms/LoginForm.tsx

"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import { AuthCheckbox } from "@/sections/auth/atoms/AuthCheckbox";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/shared-ui/component/Toast";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import { redirectByRole } from "@/libs/utils";
import Button from "@/shared-ui/component/Button";

/**
 * =====================================================
 * VALIDATION UTILITIES
 * =====================================================
 */

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
const DIGIT_REGEX = /^\d+$/;

const validateUsername = (value: string): string => {
  const v = value.trim();

  if (!v) return "Username wajib diisi";

  if (v.length < 3) return "Minimal 3 karakter";

  if (!ALPHANUMERIC_REGEX.test(v))
    return "Username hanya boleh huruf dan angka";

  if (DIGIT_REGEX.test(v)) {
    if (v.length <= 6) return "";
    if (v.length > 6 && v.length < 18)
      return "NIS maksimal 6 digit atau gunakan NIP 18 digit";
    if (v.length === 18) return "";
    if (v.length > 18) return "NIP harus 18 digit angka";
  }

  return "";
};

const validatePassword = (value: string): string => {
  if (!value) return "Kata sandi wajib diisi";
  if (value.length < 6) return "Minimal 6 karakter";
  return "";
};

/**
 * =====================================================
 * COMPONENT
 * =====================================================
 */

export default function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuthApi();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const usernameError = submitted ? validateUsername(username) : "";

  const passwordError = submitted ? validatePassword(password) : "";

  const isValid = !validateUsername(username) && !validatePassword(password);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      showErrorToast("Silakan periksa data login Anda.");
      return;
    }

    try {
      const response = await login({
        username: username.trim(),
        password,
      });

      showSuccessToast("Selamat datang!");

      if (response.mustChangePassword) {
        router.replace("/change-password");
        return;
      }

      router.replace(redirectByRole(response.role));
    } catch {
      showErrorToast(
        error?.message ?? "Login gagal, periksa kembali data Anda.",
      );
    }
  };

  const handleForgotPassword = () =>
    showInfoToast("Fitur lupa kata sandi akan segera tersedia.");

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-6"
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Silakan login ke akun Anda
        </h1>
        <p className="text-sm text-gray-500">
          Masukkan Username, NIS, atau NIP untuk masuk.
        </p>
      </div>

      {/* USERNAME */}
      <AuthTextField
        label="Username / NIS / NIP"
        value={username}
        onChangeAction={setUsername}
        placeholder="Username (huruf & angka) / NIS (6 digit) / NIP (18 digit)"
        required
        error={usernameError}
        touched={submitted}
      />

      {/* PASSWORD */}
      <AuthTextField
        label="Kata Sandi"
        type="password"
        value={password}
        onChangeAction={setPassword}
        placeholder="Masukkan kata sandi Anda"
        required
        error={passwordError}
        touched={submitted}
      />

      <div className="flex items-center justify-between text-sm">
        <AuthCheckbox
          label="Ingat Saya"
          checked={rememberMe}
          onChangeAction={setRememberMe}
        />

        <button
          type="button"
          onClick={handleForgotPassword}
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Lupa Kata Sandi
        </button>
      </div>

      <Button
        type="submit"
        variant="filled"
        color="primary"
        size="lg"
        loading={loading}
        className="w-full rounded-xl"
      >
        Masuk
      </Button>
    </form>
  );
}
