// Files: src/shared-ui/component/ui/Separator.tsx

import clsx from "clsx";
import type React from "react";

interface SeparatorProps {
	orientation?: "horizontal" | "vertical";
	className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
	orientation = "horizontal",
	className,
}) => {
	const isHorizontal = orientation === "horizontal";

	return (
		<div
			className={clsx(
				"bg-gray-200 dark:bg-gray-700",
				isHorizontal ? "h-px w-full my-2" : "w-px h-full mx-2",
				className,
			)}
			role="separator"
		/>
	);
};
