//Files: src/shared-ui/component/FilePreviewCard.tsx

"use client";

import Image from "next/image";

type Props = {
	href: string;
	onClickAction?: () => void;
};

export default function FilePreviewCard({ href, onClickAction }: Props) {

	const isImage = /\.(jpg|jpeg|png)$/i.test(href);
	const isPdf = /\.pdf$/i.test(href);

	return (
		<div
			onClick={onClickAction}
			className="w-24 h-24 border rounded-lg overflow-hidden cursor-pointer hover:shadow-md flex items-center justify-center bg-gray-50"
		>

			{isImage && (
				<div className="relative w-full h-full">
					<Image
						src={href}
						alt="preview"
						fill
						className="object-cover"
					/>
				</div>
			)}

			{isPdf && (
				<div className="text-center text-red-500 text-sm font-semibold">
					PDF
				</div>
			)}

			{!isImage && !isPdf && (
				<div className="text-gray-500 text-xs text-center">
					FILE
				</div>
			)}

		</div>
	);
}