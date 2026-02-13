//Files: src/sections/auth/pages/LoginSection.tsx
"use client";

import Image from "next/image";
import type React from "react";
import LoginForm from "@/sections/auth/organisms/LoginForm";
import { CompanyLogoIcon } from "@/shared-ui/component/Icons";

const LoginSection: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-900">
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
                                    <CompanyLogoIcon className="h-full w-full" />
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

            {/* RIGHT FORM */}
            <div className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-[420px] lg:px-10">
                <div className="w-full max-w-md">
                    {/* Brand mobile */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90">
                            <CompanyLogoIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Sistem Poin Pelanggaran
                            </p>
                            <p className="text-xs text-slate-500">
                                Monitoring & Konseling Siswa
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Selamat Datang 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Silakan login untuk mengelola data siswa dan
                            pelanggaran.
                        </p>
                    </div>

                    <LoginForm />

                    {/* Footer kanan */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <span>
                            © {year} Sistem Poin Pelanggaran Siswa
                        </span>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="hover:text-slate-600"
                            >
                                Ketentuan
                            </button>
                            <button
                                type="button"
                                className="hover:text-slate-600"
                            >
                                Kebijakan Privasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSection;
