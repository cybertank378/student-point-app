//Files: src/sections/auth/pages/AuthSection.tsx
"use client";

import Image from "next/image";
import type React from "react";
import LoginForm from "@/sections/auth/organisms/LoginForm";
import ChangePasswordForm from "@/sections/auth/organisms/ChangePasswordForm";


export type AuthMode =
    | "login"
    | "change-password"
    | "forgot-password";

interface Props {
    mode: AuthMode;
}

const AuthSection: React.FC<Props> = ({ mode }) => {
    const year = new Date().getFullYear();

    const renderContent = () => {
        switch (mode) {
            case "login":
                return {
                    title: "Selamat Datang 👋",
                    subtitle:
                        "Silakan login untuk mengelola data siswa dan pelanggaran.",
                    component: <LoginForm />,
                };

            case "change-password":
                return {
                    title: "Ganti Kata Sandi",
                    subtitle:
                        "Silakan buat kata sandi baru untuk melanjutkan.",
                    component: <ChangePasswordForm />,
                };

            case "forgot-password":
                return {
                    title: "Lupa Kata Sandi",
                    subtitle:
                        "Masukkan email untuk menerima instruksi reset.",
                    component: <div>Coming Soon</div>,
                };

            default:
                return {
                    title: "",
                    subtitle: "",
                    component: null,
                };
        }
    };

    const { title, subtitle, component } = renderContent();

    return (
        <div className="flex min-h-screen overflow-hidden">
            {/* LEFT HERO (desktop) */}
            <div className="relative hidden flex-1 overflow-hidden lg:block">
                <Image
                    src="/assets/images/login-hero.png"
                    alt="Ilustrasi sistem poin pelanggaran siswa"
                    fill
                    priority
                    className="object-cover"
                />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/75 to-slate-900/10" />

                <div className="relative z-10 flex h-full flex-col px-12 py-10">
                    {/* Konten utama */}
                    <div className="mt-auto mb-12 max-w-md space-y-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-white/20 backdrop-blur">
                                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/5">
                                    <Image
                                        src="/assets/images/logo/logo_dark.png"
                                        alt="SMPN 29 Jakarta"
                                        width={28}
                                        height={28}
                                        className="h-full w-full object-cover"
                                        sizes="28px"
                                        priority={false}
                                    />
                                </div>
                                <span>Sistem Poin Pelanggaran Siswa</span>
                            </div>

                            <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200">
                                SMP Negeri 29 Jakarta
                            </p>
                        </div>

                        <h2 className="text-4xl font-semibold leading-tight text-white">
                            Pantau Perilaku Siswa <br /> Secara Terstruktur.
                        </h2>

                        <p className="text-sm text-slate-200">
                            Kelola pelanggaran, poin siswa, dan tindak lanjut BK
                            secara terintegrasi dalam satu sistem.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-200/85">
                            <div>
                                <p className="text-base font-semibold text-white">
                                    Terstruktur
                                </p>
                                <p>Pencatatan poin pelanggaran</p>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">
                                    Transparan
                                </p>
                                <p>Riwayat siswa & eskalasi BK</p>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">
                                    Aman
                                </p>
                                <p>Akses berbasis peran multirole</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer kiri */}
                    <p className="text-xs text-slate-300/80">
                        © {year} Sistem Poin Pelanggaran Siswa.
                        Seluruh hak cipta dilindungi.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-[420px] lg:px-10">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="relative h-28 w-28">
                            <Image
                                src="/assets/images/logo/logo_dark.png"
                                alt="Logo SMPN 29 Jakarta"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                            SMP Negeri 29 Jakarta
                        </p>
                        <p className="text-xs text-slate-500">
                            Sistem Poin Pelanggaran Siswa
                        </p>
                    </div>

                    {/* Dynamic Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            {title}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {subtitle}
                        </p>
                    </div>

                    {component}

                </div>
            </div>
        </div>
    );
};

export default AuthSection;
