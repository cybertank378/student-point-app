// src/sections/student/atomic/StudentStatCard.tsx
"use client";

import {PiUsersThreeFill} from "react-icons/pi";
import {Bs7CircleFill, Bs8CircleFill, Bs9CircleFill} from "react-icons/bs";

const iconMap = {
	total: PiUsersThreeFill,
	grade7: Bs7CircleFill,
	grade8: Bs8CircleFill,
	grade9: Bs9CircleFill,
};

const colorMap = {
	total: {
		bg: "bg-sky-100",
		iconBg: "bg-pink-300 text-pink-700",
	},
	grade7: {
		bg: "bg-green-100",
		iconBg: "bg-green-300 text-green-800",
	},
	grade8: {
		bg: "bg-indigo-200",
		iconBg: "bg-blue-400 text-white",
	},
	grade9: {
		bg: "bg-teal-500",
		iconBg: "bg-pink-400 text-white",
	},
};

type Props = {
	value: string | number;
	title: string;
	iconKey: keyof typeof iconMap;
};


export default function StudentStatCard ({
											 value,
											 title,
											 iconKey,
										 }: Props) {
	const Icon = iconMap[iconKey];
	const colors = colorMap[iconKey];

	return (
		<div
			className={`relative w-full min-h-30 md:min-h-35 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between ${colors.bg}`}
		>
			{/* ICON BADGE */}
			<div
				className={`absolute top-3 right-3 md:top-4 md:right-4 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full ${colors.iconBg}`}
			>
				<Icon size={20} className="md:size-5.5" />
			</div>

			{/* VALUE */}
			<div className="text-2xl md:text-3xl mt-6 font-semibold text-slate-700">
				{value}
			</div>

			{/* LABEL */}
			<div className="text-xs md:text-sm text-slate-600">
				{title}
			</div>
		</div>

	);
}