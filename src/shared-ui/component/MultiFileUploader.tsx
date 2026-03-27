"use client";

import { useRef, useState } from "react";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import Button from "@/shared-ui/component/Button";

interface UploadFile {
	id: string;
	file: File;
	progress: number;
	uploaded: boolean;
	fileId?: string;
}

interface Props {
	maxFiles?: number;
	acceptedTypes?: string;
	onUploadedAction: (
		file: File,
		onProgress: (p: number) => void
	) => Promise<{ fileId: string }>;
}

export default function MultiFileUploader({
											  maxFiles = 5,
											  acceptedTypes = ".jpg,.jpeg,.png,.pdf",
											  onUploadedAction
										  }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	const [files, setFiles] = useState<UploadFile[]>([]);
	const [dragging, setDragging] = useState(false);

	const selectFiles = (list: FileList | null) => {
		if (!list) return;

		const newFiles = Array.from(list).map((file) => ({
			id: crypto.randomUUID(),
			file,
			progress: 0,
			uploaded: false
		}));

		setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
	};

	const startUpload = async (item: UploadFile) => {
		const result = await onUploadedAction(item.file, (p) => {
			setFiles((prev) =>
				prev.map((f) =>
					f.id === item.id ? { ...f, progress: p } : f
				)
			);
		});

		setFiles((prev) =>
			prev.map((f) =>
				f.id === item.id
					? {
						...f,
						progress: 100,
						uploaded: true,
						fileId: result.fileId
					}
					: f
			)
		);
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const uploadedCount = files.filter((f) => f.uploaded).length;

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		selectFiles(e.dataTransfer.files);
	};

	return (
		<div className="space-y-6">
			{/* Drop Area */}
			<div
				onDragOver={(e) => {
					e.preventDefault();
					setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={onDrop}
				className={`border-2 border-dashed rounded-xl p-6 flex items-center justify-between transition ${
					dragging
						? "border-blue-500 bg-blue-50"
						: "border-gray-300 bg-gray-50"
				}`}
			>
				<div className="space-y-1">
					<p className="text-sm font-semibold text-gray-800">
						Drag and drop files here or upload
					</p>

					<p className="text-xs text-gray-600">
						Accepted file types: {acceptedTypes}
					</p>
				</div>

				{/* Upload Button */}
				<Button
					variant="filled"
					color="secondary"
					size="md"
					leftIcon={FiUpload}
					onClick={() => inputRef.current?.click()}
				>
					Pilih Dokumen
				</Button>

				<input
					ref={inputRef}
					type="file"
					multiple
					accept={acceptedTypes}
					className="hidden"
					onChange={(e) => selectFiles(e.target.files)}
				/>
			</div>

			{/* Upload Counter */}
			<div className="text-sm text-gray-700">
				{uploadedCount} of {maxFiles} files uploaded
			</div>

			{/* File List */}
			{files.map((item) => (
				<div key={item.id} className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium text-gray-800">
						  {item.file.name}
						</span>

						<div className="flex items-center gap-3">
							  <span className="text-gray-600">
								{item.progress}%
							  </span>

							{item.uploaded ? (
								<FiCheck className="text-green-600" />
							) : (
								<Button
									variant="ghost"
									color="error"
									iconOnly
									leftIcon={FiX}
									size="sm"
									onClick={() => removeFile(item.id)}
								/>
							)}
						</div>
					</div>

					{/* Progress Bar */}
					<div className="w-full bg-gray-200 h-2 rounded">
						<div
							className="bg-blue-600 h-2 rounded transition-all"
							style={{
								width: `${item.progress}%`
							}}
						/>
					</div>

					{/* Start Upload Button */}
					{!item.uploaded && (
						<Button
							variant="text"
							color="info"
							size="sm"
							onClick={() => startUpload(item)}
						>
							Start Upload
						</Button>
					)}
				</div>
			))}
		</div>
	);
}