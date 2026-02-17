"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRole } from "@/libs/utils";
import { useSidebarMenu } from "@/sections/sidebar/hooks/useSidebarMenu";
import { RecursiveSidebarItem } from "@/sections/sidebar/components/RecursiveSidebarItem";
import { MdClose } from "react-icons/md";

interface Props {
    role: UserRole;
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function AppSidebar({
                                       role,
                                       mobileOpen = false,
                                       onClose,
                                   }: Props) {
    const menu = useSidebarMenu(role);
    const pathname = usePathname();

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    /* ================= AUTO OPEN ACTIVE PARENT ================= */
    useEffect(() => {
        const parentIndex = menu.findIndex((item) =>
            item.children?.some((child) => child.path === pathname)
        );

        if (parentIndex !== -1) {
            setExpandedIndex(parentIndex);
        }
    }, [pathname, menu]);

    /* ================= AUTO CLOSE MOBILE ON ROUTE CHANGE ================= */
    useEffect(() => {
        if (mobileOpen && onClose) {
            onClose();
        }
    }, [pathname]);

    /* ================= SIDEBAR CONTENT ================= */
    const SidebarContent = (
        <div className="h-screen w-[259px] bg-slate-800 text-indigo-100 flex flex-col">
            {/* HEADER */}
            <div className="h-16 flex items-center justify-between px-4">
                <Image
                    src="/assets/images/logo/logo.png"
                    alt="Logo"
                    width={28}
                    height={28}
                />

                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden text-indigo-100"
                    >
                        <MdClose size={22} />
                    </button>
                )}
            </div>

            <div className="h-px bg-slate-700 opacity-50" />

            {/* MENU */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {menu.map((item, index) => (
                    <RecursiveSidebarItem
                        key={item.label}
                        item={item}
                        index={index}
                        expandedIndex={expandedIndex}
                        setExpandedIndex={setExpandedIndex}
                        collapsed={false}
                    />
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* ================= DESKTOP ================= */}
            <aside className="hidden md:flex h-screen">
                {SidebarContent}
            </aside>

            {/* ================= MOBILE ================= */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Slide Panel */}
                        <motion.aside
                            className="fixed top-0 left-0 z-50 md:hidden"
                            initial={{ x: -259 }}
                            animate={{ x: 0 }}
                            exit={{ x: -259 }}
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        >
                            {SidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
