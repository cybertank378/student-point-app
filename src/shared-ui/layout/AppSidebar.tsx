"use client";

import {useState, useEffect, useMemo} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRole } from "@/libs/utils";
import { RecursiveSidebarItem } from "@/sections/sidebar/components/RecursiveSidebarItem";
import { ArrowMenuIcon } from "@/shared-ui/component/Icons";
import {generateSidebar} from "@/modules/auth/domain/rbac/sidebar/getSidebarMenu";

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
    const pathname = usePathname();

    // ⬇️ GUNAKAN DI SINI
    const menu = useMemo(() => generateSidebar(role), [role]);


    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed((prev) => !prev);
    };

    /* ================= AUTO OPEN ACTIVE PARENT ================= */
    useEffect(() => {
        const parentIndex = menu.findIndex((item) =>
            item.children?.some((child) =>
                child.path && pathname.startsWith(child.path)
            )
        );

        if (parentIndex !== -1) {
            setExpandedIndex(parentIndex);
        } else if (pathname === "/dashboard") {
            const masterIndex = menu.findIndex(
                (item) => item.label === "Master Akademik"
            );

            setExpandedIndex(masterIndex !== -1 ? masterIndex : null);
        } else {
            setExpandedIndex(null);
        }
    }, [pathname]); // ✅ HANYA pathname

    /* ================= AUTO CLOSE MOBILE ON ROUTE CHANGE ================= */
    useEffect(() => {
        if (mobileOpen && onClose) {
            onClose();
        }
    }, [pathname]);

    /* ================= SIDEBAR CONTENT ================= */
    const SidebarContent = (
        <motion.div
            animate={{ width: collapsed ? 80 : 259 }}
            transition={{ duration: 0.3 }}
            className="h-screen bg-slate-800 text-indigo-100 flex flex-col overflow-hidden"
        >
            {/* ================= HEADER ================= */}
            <div>
                <div className="h-16 flex items-center px-4 border-b">

                    {/* LEFT GROUP */}
                    <div className="flex items-center gap-3 flex-1">
                        <Image
                            src="/assets/images/logo/logo_light.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className={`shrink-0 ${
                                collapsed ? "mx-auto cursor-pointer" : ""
                            }`}
                            onClick={() => {
                                if (collapsed) toggleCollapse();
                            }}
                        />

                        {!collapsed && (
                            <div className="flex flex-col leading-tight">
                                <span className="text-white font-semibold text-sm">
                                    SMP Negeri 29
                                </span>
                                <span className="text-indigo-200 text-xs">
                                    Jakarta
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ARROW (Collapse Trigger) */}
                    {!collapsed && (
                        <button
                            onClick={toggleCollapse}
                            className="text-indigo-200 hover:text-white transition"
                        >
                            <ArrowMenuIcon />
                        </button>
                    )}
                </div>


            </div>


            {/* ================= MENU ================= */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {menu.map((item, index) => (
                    <RecursiveSidebarItem
                        key={item.label}
                        item={item}
                        index={index}
                        expandedIndex={expandedIndex}
                        setExpandedIndex={setExpandedIndex}
                        collapsed={collapsed}
                    />
                ))}
            </nav>
        </motion.div>
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
