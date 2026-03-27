"use client";

import dynamic from "next/dynamic";
import Loading from "@/shared-ui/component/Loading";

const PdfViewerClient = dynamic(
	() => import("./PdfViewerClient"),
	{
		ssr: false,
		loading: () => (
			<div className="p-6 text-center">
				<Loading />
			</div>
		),
	}
);

type Props = {
	fileUrl: string;
};

export default function PdfViewer({ fileUrl}: Props) {
	return <PdfViewerClient fileUrl={fileUrl} />;
}