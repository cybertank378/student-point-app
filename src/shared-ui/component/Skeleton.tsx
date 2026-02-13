//src/shared/component/ui/Skeleton.tsx
"use client";
import clsx from "clsx";
import type React from "react";

interface SkeletonProps {
	className?: string;
	width?: string | number;
	height?: string | number;
	rounded?: boolean;
	count?: number;
	gap?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
	className,
	width = "100%",
	height = 20,
	rounded = true,
	count = 1,
	gap = 8,
}) => {
	const items = Array.from({ length: count });

	return (
		<div className={clsx("flex flex-col", className)} style={{ gap }}>
			{items.map((_, idx) => (
				<div
					key={idx}
					className={clsx(
						"animate-pulse bg-gray-300 dark:bg-gray-700",
						rounded && "rounded",
					)}
					style={{ width, height }}
				/>
			))}
		</div>
	);
};
