//Files: src/shared-ui/component/FilePreviewLink.tsx
"use client";

interface Props {
	href?: string | null;
	label?: string;
	className?: string;
}

export default function FilePreviewLink({
											href,
											label = "Lihat File",
											className = "text-blue-600 text-sm underline"
										}: Props) {

	if (!href) return null;

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={className}
		>
			{label}
		</a>
	);
}