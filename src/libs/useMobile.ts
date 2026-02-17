//Files: src/libs/useMobile.ts
"use client";

import { useEffect, useState } from "react";

export function useMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return {
        isMobile,
        isDesktop: !isMobile,
        device: isMobile ? "mobile" as const : "desktop" as const,
    };
}
