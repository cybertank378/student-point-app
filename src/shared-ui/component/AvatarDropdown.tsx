//Files: src/shared-ui/component/AvatarDropdown.tsx

"use client";

import { getAvatarMenuByRole } from "@/modules/auth/domain/rbac/rbacConfig";
import type { UserRole } from "@/libs/utils";
import { DropdownItem } from "@/shared-ui/component/DropdownItem";
import { useAuthApi } from "@/modules/auth/presentation/hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/shared-ui/component/Button";
import { FiLogOut } from "react-icons/fi";

interface Props {
    role: UserRole;
}

export default function AvatarDropdown({ role }: Props) {
    const router = useRouter();
    const { logout } = useAuthApi();
    const [loading, setLoading] = useState(false);

    const menu = getAvatarMenuByRole(role);

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

    return (
        <>
            {/* Dynamic Menu */}
            <div className="py-2">
                {menu.map((item, index) => {
                    // Handle logout action separately
                    if (item.action === "LOGOUT") {
                        return null; // logout button rendered below
                    }

                    return (
                        <DropdownItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => {
                                if (item.path) router.push(item.path);
                            }}
                        />
                    );
                })}
            </div>

            <div className="border-t border-gray-100" />

            {/* Logout Button */}
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
        </>
    );
}
