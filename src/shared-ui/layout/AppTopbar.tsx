"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import type { UserRole } from "@/libs/utils";
import {
    FiBell,
    FiSearch,
    FiLogOut,
    FiUser,
    FiSettings,
    FiFileText,
    FiDollarSign,
    FiHelpCircle,
} from "react-icons/fi";
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

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    return (
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm">
            <div className="h-full px-4 md:px-8 flex items-center justify-between gap-3">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-3 flex-1 min-w-0">

                    {/* Hamburger */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-gray-600 shrink-0"
                    >
                        <MdMenu size={22} />
                    </button>

                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 h-10 border border-gray-300 rounded-lg bg-white focus-within:border-indigo-500 transition-colors flex-1 min-w-0">
                        <FiSearch size={16} className="text-gray-500 shrink-0" />

                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 min-w-0"
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3 shrink-0">
                    <FiBell size={18} className="text-gray-600" />

                    {/* Avatar */}
                    <div className="relative" ref={dropdownRef}>
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
                    </div>
                </div>
            </div>
        </header>

    );
}
