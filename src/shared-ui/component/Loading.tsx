"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SPINNER_SIZE = 80;

// Bikin komponen Image yang bisa dianimasikan
const MotionImage = motion(Image);

function Loading() {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
			}}
		>
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 16,
				}}
			>
				{/* Logo + ring loading */}
				<div
					style={{
						position: "relative",
						width: SPINNER_SIZE,
						height: SPINNER_SIZE,
					}}
				>
					{/* Logo PTI */}
					<MotionImage
						src="/assets/images/logo.svg" // ⬅️ path dari public
						alt="Logo PTI"
						width={SPINNER_SIZE}
						height={SPINNER_SIZE}
						style={{
							objectFit: "contain",
						}}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.4 }}
					/>

					{/* Ring loading yang berputar */}
					<motion.div
						style={{
							position: "absolute",
							inset: 0,
							borderRadius: "999px",
							borderWidth: 4,
							borderStyle: "solid",
							borderColor: "rgba(0,0,0,0.08)",
							borderTopColor: "#000",
							boxSizing: "border-box",
						}}
						animate={{ rotate: 360 }}
						transition={{
							repeat: Infinity,
							duration: 1.1,
							ease: "linear",
						}}
					/>
				</div>

				{/* Teks LOADING + animasi titik */}
				<motion.div
					style={{
						display: "flex",
						alignItems: "baseline",
						gap: 4,
						fontWeight: 600,
						letterSpacing: "0.18em",
						textTransform: "uppercase",
					}}
				>
					<span>Loading</span>
					<motion.span
						style={{ display: "inline-block" }}
						animate={{ opacity: [0.2, 1, 0.2] }}
						transition={{
							repeat: Infinity,
							duration: 1.2,
							ease: "easeInOut",
						}}
					>
						...
					</motion.span>
				</motion.div>
			</div>
		</div>
	);
}

export default Loading;
