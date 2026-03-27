"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "@/shared-ui/component/Button";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = {
	fileUrl: string;
};

export default function PdfViewerClient({ fileUrl }: Props) {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [scale, setScale] = useState<number>(1.2);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	};

	return (
		<div className="w-full h-full flex flex-col">

			{/* Toolbar */}
			<div className="flex justify-center gap-2 border-b py-2 bg-white">
				<Button
					size="sm"
					variant="outline"
					disabled={pageNumber <= 1}
					onClick={() => setPageNumber(p => Math.max(1, p - 1))}
				>
					Prev
				</Button>

				<div className="text-sm flex items-center">
					{pageNumber} / {numPages}
				</div>

				<Button
					size="sm"
					variant="outline"
					disabled={pageNumber >= numPages}
					onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
				>
					Next
				</Button>

				<Button
					size="sm"
					variant="outline"
					onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
				>
					Zoom -
				</Button>

				<Button
					size="sm"
					variant="outline"
					onClick={() => setScale(s => s + 0.2)}
				>
					Zoom +
				</Button>
			</div>

			{/* PDF Container */}
			<div className="flex-1 overflow-auto bg-gray-300 flex justify-center">
				<div className="my-4">
					<Document
						file={fileUrl}
						onLoadSuccess={onDocumentLoadSuccess}
					>
						<Page
							pageNumber={pageNumber}
							scale={scale}
							renderTextLayer
							renderAnnotationLayer
						/>
					</Document>
				</div>
			</div>

		</div>
	);
}