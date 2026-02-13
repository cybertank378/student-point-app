// Files: src/shared-ui/component/ui/SummaryCard.tsx
import clsx from "clsx";
import type React from "react";

type SummaryCardProps = {
	title: string;
	value: React.ReactNode;
	subtitle?: string;
	className?: string;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
	title,
	value,
	subtitle,
	className,
}) => {
	return (
		<div
			className={clsx(
				// base style card
				"flex h-full w-full flex-col rounded-xl border px-4 py-3 shadow-sm bg-white",
				className, // warna / tambahan lain dari luar
			)}
		>
			<p className="text-xs font-medium text-muted-foreground">{title}</p>
			<p className="mt-2 text-xl font-semibold">{value}</p>
			{subtitle && (
				<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
			)}
		</div>
	);
};
