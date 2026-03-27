"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import MultiFileUploader from "@/shared-ui/component/MultiFileUploader";
import Button from "@/shared-ui/component/Button";
import { showErrorToast } from "@/shared-ui/component/Toast";
import { getViewerUrl } from "@/libs/utils";
import {DeleteResult, UploadResult} from "@/modules/shared/utils/FileUploadTypes";

const PdfViewer = dynamic(
	() => import("@/shared-ui/component/PdfViewer"),
	{ ssr: false }
);


type Props = {
	studentId: string;
	nisn: string;
	academicYear: string;
	value?: string[];
	onUploadAction: (
		studentId: string,
		file: File,
		nisn: string,
		academicYear: string
	) => Promise<UploadResult>;
	onDeleteAction?: (
		studentId: string,
		filePath: string
	) => Promise<DeleteResult>;
	onChangeAction?: (documents: string[]) => void;
};

export default function DocumentsUploader({
											  studentId,
											  nisn,
											  academicYear,
											  value = [],
											  onUploadAction,
											  onDeleteAction,
											  onChangeAction
										  }: Props) {



	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const documents = value ?? [];

	const addDocument = (fileUrl: string) => {
		if (documents.includes(fileUrl)) return;
		onChangeAction?.([...documents, fileUrl]);
	};

	const removeDocument = async (fileUrl: string): Promise<void> => {
		try {
			if (onDeleteAction) {
				const result = await onDeleteAction(studentId, fileUrl);

				if (!result.success) {
					throw new Error(result.error?.message || "Gagal menghapus file");
				}
			}

			onChangeAction?.(documents.filter((d) => d !== fileUrl));

		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Terjadi kesalahan";
			showErrorToast(message);
		}
	};

	const isImage = (url: string) =>
		/\.(jpg|jpeg|png|webp)$/i.test(url);

	const isPdf = (url: string) =>
		/\.pdf$/i.test(url);

	return (
		<div className="space-y-4">

			<MultiFileUploader
				maxFiles={5}
				onUploadedAction={async (file, progress) => {
					try {
						const result = await onUploadAction(
							studentId,
							file,
							nisn,
							academicYear
						);

						if (!result.data?.fileUrl) {
							throw new Error(result.error?.message || "Upload gagal");
						}

						progress(100);
						addDocument(result.data.fileUrl);

						return { fileId: result.data.fileUrl };

					} catch (err: any) {
						showErrorToast(err.message);
						throw err;
					}
				}}
			/>

			{documents.length > 0 && (
				<div className="grid grid-cols-4 gap-3">
					{documents.map((fileUrl) => (
						<div
							key={fileUrl}
							className="border rounded-lg overflow-hidden bg-white shadow-sm"
						>
							<div
								className="h-24 relative cursor-pointer bg-gray-100"
								onClick={() => setPreviewUrl(fileUrl)}
							>
								{isImage(fileUrl) ? (
									<Image
										src={fileUrl}
										alt="preview"
										fill
										className="object-cover"
									/>
								) : (
									<div className="flex items-center justify-center h-full text-gray-500 text-sm">
										{isPdf(fileUrl) ? "PDF" : "FILE"}
									</div>
								)}
							</div>

							<div className="flex justify-between p-2">
								<Button
									size="sm"
									variant="text"
									color="info"
									onClick={() => setPreviewUrl(fileUrl)}
								>
									Preview
								</Button>

								<Button
									size="sm"
									variant="text"
									color="error"
									onClick={() => removeDocument(fileUrl)}
								>
									Hapus
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{previewUrl && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg w-auto h-[95%] flex flex-col">
						<div className="border-b px-4 py-2 flex justify-between items-center">
							<div className="font-semibold text-gray-900">
								Document Preview
							</div>

							<Button
								size="sm"
								color="primary"
								onClick={() => setPreviewUrl(null)}
							>
								Close
							</Button>
						</div>

						<div className="flex-1 overflow-auto flex items-center justify-center p-4">
							{isPdf(previewUrl) && (
								<PdfViewer fileUrl={previewUrl} />
							)}

							{isImage(previewUrl) && (
								<div className="relative w-full h-full">
									<Image
										src={previewUrl}
										alt="Preview"
										fill
										className="object-contain"
									/>
								</div>
							)}

							{!isPdf(previewUrl) && !isImage(previewUrl) && (
								<iframe
									src={getViewerUrl(previewUrl)}
									className="w-full h-full"
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}