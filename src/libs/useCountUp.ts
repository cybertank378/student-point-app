//Files: src/libs/useCountUp.ts
"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
    duration?: number;
}

export function useCountUp(
    value: number,
    options?: UseCountUpOptions
) {
    const { duration = 700 } = options || {};

    const [displayValue, setDisplayValue] = useState(0);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        let startTimestamp: number | null = null;

        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;

            const progress = timestamp - startTimestamp;
            const raw = Math.min(progress / duration, 1);
            const eased = easeOut(raw);

            setDisplayValue(Math.floor(eased * value));

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(step);
            }
        };

        frameRef.current = requestAnimationFrame(step);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [value, duration]);

    return displayValue;
}