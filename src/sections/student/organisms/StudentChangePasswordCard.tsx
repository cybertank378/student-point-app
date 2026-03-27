"use client";

import { useState } from "react";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";
import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";

/* =========================================================
 PASSWORD STRENGTH
 ========================================================= */

type StrengthLevel = "lemah" | "sedang" | "kuat" | "sangat-kuat";

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

const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level: StrengthLevel = "lemah";

  if (score >= 5) level = "sangat-kuat";
  else if (score === 4) level = "kuat";
  else if (score === 3) level = "sedang";

  return { score, level, checks };
};

export default function StudentChangePasswordCard() {
  const { changePassword, loading, error } = useAuthApi();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async () => {
    if (!oldPassword) {
      showErrorToast("Password lama wajib diisi");
      return;
    }

    if (newPassword.length < 8) {
      showErrorToast("Password baru minimal 8 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Konfirmasi password tidak sama");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);

      showSuccessToast("Password berhasil diperbarui");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showErrorToast(error?.message ?? "Gagal mengubah password");
    }
  };

  return (
    <div className="border bg-white rounded-lg p-6 space-y-5">
      {/* Judul */}
      <h2 className="text-lg font-semibold text-gray-700">Ubah Password</h2>

      {/* Informasi */}
      <div className="rounded-lg bg-orange-100 p-4 text-sm text-orange-700">
        <p className="font-medium">Pastikan password memenuhi persyaratan berikut</p>
        <p className="text-xs mt-1">Minimal 8 karakter, mengandung huruf besar dan simbol</p>
      </div>

      {/* Field */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PASSWORD LAMA */}
        <TextField
          label="Password Lama"
          type="password"
          enablePasswordToggle
          value={oldPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
        />

        {/* PASSWORD BARU */}
        <div className="space-y-2">
          <TextField
            label="Password Baru"
            type="password"
            enablePasswordToggle
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          />

          {newPassword.length > 0 && (
            <div className="space-y-2">
              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength.level === "lemah"
                      ? "w-1/4 bg-red-500"
                      : strength.level === "sedang"
                        ? "w-2/4 bg-yellow-500"
                        : strength.level === "kuat"
                          ? "w-3/4 bg-emerald-500"
                          : "w-full bg-green-600"
                  }`}
                />
              </div>

              {/* Label */}
              <p
                className={`text-xs font-medium ${
                  strength.level === "lemah"
                    ? "text-red-500"
                    : strength.level === "sedang"
                      ? "text-yellow-500"
                      : strength.level === "kuat"
                        ? "text-emerald-600"
                        : "text-green-700"
                }`}
              >
                Kekuatan Password:{" "}
                {strength.level === "lemah"
                  ? "Lemah"
                  : strength.level === "sedang"
                    ? "Sedang"
                    : strength.level === "kuat"
                      ? "Kuat"
                      : "Sangat Kuat"}
              </p>

              {/* Checklist */}
              <ul className="space-y-1 text-xs text-gray-600">
                <li className={strength.checks.length ? "text-emerald-600" : ""}>✓ Minimal 8 karakter</li>
                <li className={strength.checks.lowercase ? "text-emerald-600" : ""}>✓ Huruf kecil</li>
                <li className={strength.checks.uppercase ? "text-emerald-600" : ""}>✓ Huruf besar</li>
                <li className={strength.checks.number ? "text-emerald-600" : ""}>✓ Angka</li>
                <li className={strength.checks.symbol ? "text-emerald-600" : ""}>✓ Simbol</li>
              </ul>
            </div>
          )}
        </div>

        {/* KONFIRMASI */}
        <TextField
          label="Konfirmasi Password Baru"
          type="password"
          enablePasswordToggle
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          error={confirmPassword && newPassword !== confirmPassword ? "Konfirmasi password tidak sama" : undefined}
        />
      </div>

      {/* Tombol */}
      <Button onClick={handleSubmit} loading={loading} disabled={loading} variant="filled" color="primary" size="md" className="w-fit">
        Ubah Password
      </Button>
    </div>
  );
}
