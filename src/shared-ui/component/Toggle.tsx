"use client";

import type React from "react";

interface ToggleProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	checked: boolean;
	onChange?: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
	checked,
	onChange,
	className,
	...props
}) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		props.onClick?.(e);
		onChange?.(!checked);
	};

	// ukuran diset mendekati contoh
	const TRACK_WIDTH = 36;
	const TRACK_HEIGHT = 20;
	const KNOB_SIZE = 16;
	const KNOB_OFFSET = 16; // seberapa jauh geser ke kanan saat ON

	const trackStyle: React.CSSProperties = {
		width: TRACK_WIDTH,
		height: TRACK_HEIGHT,
		borderRadius: 9999,
		display: "inline-flex",
		alignItems: "center",
		paddingLeft: 2, // jarak awal knob
		position: "relative",
		cursor: "pointer",
		boxSizing: "border-box",
		backgroundColor: checked ? "#FFE39A" : "#FFFFFF", // kuning / putih
		border: `1px solid ${checked ? "#F2C94C" : "#111827"}`, // kuning / hampir hitam
		transition: "background-color 150ms ease, border-color 150ms ease",
	};

	const knobStyle: React.CSSProperties = {
		width: KNOB_SIZE,
		height: KNOB_SIZE,
		borderRadius: 9999,
		boxSizing: "border-box",
		backgroundColor: checked ? "#1BA339" : "#FFFFFF", // hijau / putih
		border: `1px solid ${checked ? "#0F7A27" : "#9CA3AF"}`,
		boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
		transform: checked ? `translateX(${KNOB_OFFSET}px)` : "translateX(0px)",
		transition:
			"transform 150ms ease, background-color 150ms ease, border-color 150ms ease",
	};

	return (
		<button
			type="button"
			aria-pressed={checked}
			onClick={handleClick}
			style={trackStyle}
			className={className}
			{...props}
		>
			<span style={knobStyle} />
		</button>
	);
};
