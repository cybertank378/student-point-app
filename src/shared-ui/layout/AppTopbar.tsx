//Files: src/shared-ui/layout/AppTopbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import { UserRole } from "@/libs/utils";
import {
    FiSearch,
    FiGlobe,
    FiMoon,
    FiStar,
    FiBell,
    FiUser,
    FiFileText,
    FiSettings,
    FiDollarSign,
    FiHelpCircle,
    FiLogOut,
} from "react-icons/fi";
import Image from "next/image";
import { DropdownItem } from "@/shared-ui/component/DropdownItem";

interface Props {
    role: UserRole;
    username?: string;
    onToggleTopBar: () => void;
}

export default function AppTopbar({
                                      role,
                                      username,
                                      onToggleTopBar,
                                  }: Props) {
    const router = useRouter();
    const { logout } = useAuthApi(); // ✅ dari hook

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ===== HANDLE LOGOUT =====
    const handleLogout = async () => {
        try {
            setLoading(true);

            await logout(); // ✅ gunakan hook

            setIsOpen(false); // tutup dropdown
            router.push("/login");
            router.refresh(); // redirect
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // ===== CLICK OUTSIDE CLOSE =====
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
            <div className="h-full px-8 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex-1 max-w-md">
                    <div className="flex items-center gap-3 px-4 h-10 border border-gray-300 rounded-lg bg-white focus-within:border-indigo-500 transition-colors">

                        <FiSearch size={18} className="text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search 8K"
                            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">

                    <FiGlobe size={18} className="icon-style" />
                    <FiMoon size={18} className="icon-style" />
                    <FiStar size={18} className="icon-style" />

                    <div className="relative cursor-pointer">
                        <FiBell size={18} className="icon-style" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                    {/* ===== AVATAR ===== */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="relative w-9 h-9 rounded-full overflow-hidden focus:outline-none"
                        >
                            <Image
                                src="/assets/images/avatar.png"
                                alt="User Avatar"
                                width={36}
                                height={36}
                                className="rounded-full object-cover"
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute right-2 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                                {/* USER HEADER */}
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
                                            {username}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {role}
                                        </p>
                                    </div>
                                </div>

                                {/* MENU */}
                                <div className="py-2">
                                    <DropdownItem icon={FiUser} label="My Profile" />
                                    <DropdownItem icon={FiSettings} label="Settings" />
                                    <DropdownItem icon={FiFileText} label="Billing Plan" badge="4" />
                                </div>

                                <div className="border-t border-gray-100" />

                                <div className="py-2">
                                    <DropdownItem icon={FiDollarSign} label="Pricing" />
                                    <DropdownItem icon={FiHelpCircle} label="FAQ" />
                                </div>

                                <div className="border-t border-gray-100" />

                                {/* LOGOUT */}
                                <div className="p-6">
                                    <button
                                        onClick={handleLogout}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
                                    >
                                        <FiLogOut size={16} />
                                        {loading ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}



