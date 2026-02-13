//File: src/sections/auth/atoms/AuthCheckbox.tsx
"use client";

import type React from "react";

type Props = {
	label: string;
	checked: boolean;
	onChangeAction: (checked: boolean) => void;
};

export const AuthCheckbox: React.FC<Props> = ({
	label,
	checked,
	onChangeAction,
}) => (
	<label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
		<span
			className={
				"flex h-4 w-4 items-center justify-center rounded border " +
				(checked
					? "border-emerald-500 bg-emerald-500"
					: "border-gray-300 bg-white")
			}
		>
			{checked && (
				<svg
					className="h-3 w-3 text-white"
					viewBox="0 0 14 14"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M11.667 3L5.25 9.417 2.333 6.5"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</span>
		<input
			type="checkbox"
			checked={checked}
			onChange={(e) => onChangeAction(e.target.checked)}
			className="hidden"
		/>
		<span>{label}</span>
	</label>
);

export default AuthCheckbox;
