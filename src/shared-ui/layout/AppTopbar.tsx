"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { UserRole } from "@/libs/utils";

import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import {
    getAvatarMenuByRole,
    roleConfig,
} from "@/modules/auth/domain/rbac/rbacConfig";

import { FiBell, FiSearch, FiLogOut } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import Image from "next/image";

import { DropdownItem } from "@/shared-ui/component/DropdownItem";
import Button from "@/shared-ui/component/Button";

interface Props {
    role: UserRole;
    username?: string;
    onMenuClick?: () => void;
}

export default function AppTopbar({
                                      role,
                                      username,
                                      onMenuClick,
                                  }: Props) {
    const router = useRouter();
    const { logout } = useAuthApi();

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🔹 Get dynamic avatar menu based on role
    const avatarMenu = getAvatarMenuByRole(role);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            router.push("/login");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handler);
        }

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [isOpen]);

    return (
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm">
            <div className="h-full px-4 md:px-8 flex items-center justify-between gap-3">

                {/* ================= LEFT SECTION ================= */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-gray-600 shrink-0"
                    >
                        <MdMenu size={22} />
                    </button>

                    <div className="flex items-center gap-2 px-3 h-10 border border-gray-300 rounded-lg bg-white focus-within:border-indigo-500 transition-colors flex-1 min-w-0">
                        <FiSearch size={16} className="text-gray-500 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 min-w-0"
                        />
                    </div>
                </div>

                {/* ================= RIGHT SECTION ================= */}
                <div className="flex items-center gap-4 shrink-0">
                    <FiBell size={18} className="text-gray-600" />

                    {/* ================= AVATAR ================= */}
                    <div className="relative z-50" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="w-8 h-8 rounded-full overflow-hidden"
                        >
                            <Image
                                src="/assets/images/avatar.png"
                                alt="User Avatar"
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                                {/* ===== USER HEADER ===== */}
                                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src="/assets/images/avatar.png"
                                            alt="User"
                                            fill
                                            className="object-cover"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {username || "User"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {roleConfig[role].label}
                                        </p>
                                    </div>
                                </div>

                                {/* ===== DYNAMIC MENU ===== */}
                                <div className="py-2">
                                    {avatarMenu.map((item, index) => {
                                        if (item.action === "LOGOUT") {
                                            return null; // logout handled separately
                                        }

                                        return (
                                            <DropdownItem
                                                key={index}
                                                icon={item.icon}
                                                label={item.label}
                                                onClick={() => {
                                                    if (item.path) {
                                                        router.push(item.path);
                                                        setIsOpen(false);
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="border-t border-gray-100" />

                                {/* ===== LOGOUT BUTTON ===== */}
                                <div className="p-4">
                                    <Button
                                        type="button"
                                        onClick={handleLogout}
                                        loading={loading}
                                        variant="filled"
                                        color="error"
                                        leftIcon={FiLogOut}
                                        className="w-full"
                                    >
                                        {loading ? "Logging out..." : "Logout"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
