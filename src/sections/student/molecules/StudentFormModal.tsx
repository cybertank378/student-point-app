"use client";

import Image from "next/image";
import {FiX} from "react-icons/fi";
import {useState} from "react";

import {buildUserImagePath} from "@/libs/utils";

import {useReligionApi} from "@/modules/religion/presentation/hooks/useReligionApi";
import {useStudentApi} from "@/modules/student/presentation/hooks/useStudentApi";

import Button from "@/shared-ui/component/Button";
import Divider from "@/shared-ui/component/Divider";
import {Modal} from "@/shared-ui/component/Modal";
import SelectField from "@/shared-ui/component/SelectField";
import Switch from "@/shared-ui/component/Switch";
import TextField from "@/shared-ui/component/TextField";
import {showErrorToast, showSuccessToast} from "@/shared-ui/component/Toast";
import {UploadButton} from "@/shared-ui/component/UploadButton";

import {StudentFormType} from "@/modules/student/domain/types/StudentFormType";
import type {StudentCompositeDTO} from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {FamilyStatus, Gender, HouseOwnership} from "@/libs/utils/enums";
import TextAreaField from "@/shared-ui/component/TextAreaField";
import DocumentsUploader from "@/shared-ui/component/DocumentUploader";
import {useStudentFamilyInfoApi} from "@/modules/student-family-info/presentation/hooks/useStudentFamilyInfoApi";
import ReadOnlyField from "@/shared-ui/component/ReadOnlyField";

/* ============================================================
 PROPS
 ============================================================ */

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	form: StudentFormType;
	onChange: <K extends keyof StudentFormType>(
		field: K,
		value:
			| StudentFormType[K]
			| ((prev: StudentFormType[K]) => StudentFormType[K])
	) => void;
	student: StudentCompositeDTO | null;
	mode: "add" | "edit";
	title?: string;
	subtitle?: string;
	loading?: boolean;
}

/* ============================================================
 COMPONENT
 ============================================================ */

export default function StudentFormModal ({
											  open,
											  onClose,
											  onSubmit,
											  form,
											  student,
											  onChange,
											  mode,
											  title,
											  subtitle,
											  loading = false
										  }: Props) {

	/* ============================================================
	 EXTERNAL DATA
	 ============================================================ */

	const {religions} = useReligionApi ();
	const { uploadStudentDocument, deleteStudentDocument } = useStudentFamilyInfoApi()
	const {uploadStudentImage} = useStudentApi ();
	const academicYearName =  student?.enrollments?.[0]?.academicYear?.name ?? "";

	/* ============================================================
	 DERIVED STATE
	 ============================================================ */

	const isAdd = mode === "add";

	/* ============================================================
	 LOCAL STATE
	 ============================================================ */

	const [fieldErrors] = useState<Record<string, string>> ({});
	const studentId = student?.id as string;

	/* ============================================================
	 UI TEXT
	 ============================================================ */

	const dynamicTitle =
		title ??
		(isAdd
			? "Tambah Siswa"
			: `Edit ${form.name ?? "Siswa"}`);

	const dynamicSubtitle =
		subtitle ??
		(isAdd
			? "Buat data siswa baru"
			: "Perbarui informasi siswa");
	/* ============================================================
	 HELPER FAMILY FORM
	 ============================================================ */
	type FamilyForm = NonNullable<StudentFormType["family"]>;

	const ensureFamily = (
		family?: StudentFormType["family"]
	): FamilyForm => ({
		livingWith: family?.livingWith ?? "",
		houseOwnership: family?.houseOwnership ?? null,
		headOfFamilyName: family?.headOfFamilyName ?? "",
		familyCardAddress: family?.familyCardAddress ?? "",
		documents: family?.documents ?? [],
	});

	const family = ensureFamily(form.family);

	const father = student?.parents?.find(p => p.role === "FATHER")?.parent;
	const mother = student?.parents?.find(p => p.role === "MOTHER")?.parent;
	const guardian = student?.parents?.find(p => p.role === "GUARDIAN")?.parent;

	const familyStatus = form.familyStatus;

	const showFather =
		familyStatus === FamilyStatus.COMPLETE ||
		familyStatus === FamilyStatus.SINGLE_FATHER;

	const showMother =
		familyStatus === FamilyStatus.COMPLETE ||
		familyStatus === FamilyStatus.SINGLE_MOTHER;

	const showGuardian =
		familyStatus === FamilyStatus.ORPHAN;


	/* ============================================================
	 PHOTO UPLOAD
	 ============================================================ */

	const handleUpload = async (
		file: File,
		onProgress: (percent: number) => void
	) => {

		if (!studentId) {
			showErrorToast ("Siswa belum dipilih.");
			throw new Error ("Siswa belum dipilih.");
		}

		try {

			onProgress (20);

			const result = await uploadStudentImage (studentId, file);

			if (!result.data) {
				showErrorToast (result.error?.message ?? "Upload gagal");
				return;
			}

			onChange ("photo", result.data.fileName);

			onProgress (100);

			showSuccessToast ("Foto berhasil diupload");

		} catch (error) {

			showErrorToast (
				error instanceof Error
					? error.message
					: "Upload gagal"
			);

			throw error;
		}

	};

	/* ============================================================
	 DOCUMENT UPLOAD
	 ============================================================ */
	const handleUploadStudentDocument = async (
		studentId: string,
		file: File,
		nisn: string,
		academicYear: string
	) => {
		if (!studentId) {
			showErrorToast("Siswa belum dipilih.");
			return {
				data: null,
				error: { message: "Siswa belum dipilih", statusCode: 400 }
			};
		}

		try {
			const result = await uploadStudentDocument(
				studentId,
				file,
				nisn,
				academicYear
			);

			if (result.error) {
				showErrorToast(result.error.message);
				return result;
			}

			showSuccessToast("Dokumen berhasil diupload");
			return result;

		} catch (error) {
			showErrorToast(
				error instanceof Error
					? error.message
					: "Upload gagal"
			);

			return {
				data: null,
				error: {
					message: "Upload gagal",
					statusCode: 500
				}
			};
		}
	};

	/* ============================================================
	 * DOCUMENT DELETE
	 * ============================================================ */
	const handleDeleteStudentDocument = async (
		studentId: string,
		filePath: string
	): Promise<{
		success: boolean;
		error?: { message: string } | null;
	}> => {

		if (!studentId) {
			showErrorToast("Siswa belum dipilih.");
			return {
				success: false,
				error: { message: "Siswa belum dipilih." }
			};
		}

		try {
			const result = await deleteStudentDocument(studentId, filePath);

			if (!result.success) {
				showErrorToast(result.error?.message ?? "Gagal menghapus dokumen");
				return result;
			}

			showSuccessToast("Dokumen berhasil dihapus");

			return {
				success: true
			};

		} catch (error) {

			const message =
				error instanceof Error ? error.message : "Gagal menghapus dokumen";

			showErrorToast(message);

			return {
				success: false,
				error: { message }
			};
		}
	};

	/* ============================================================
	 RENDER
	 ============================================================ */

	return (
		<Modal
			open={open}
			onClose={onClose}
			onSubmit={onSubmit}
			title={dynamicTitle}
			subtitle={dynamicSubtitle}
			submitDisabled={loading}
			size="xl"
		>

			<div className="space-y-10">

				{/* FOTO + IDENTITAS */}

				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">

					{/* PHOTO PANEL */}

					<div className="md:col-span-1 flex justify-center md:justify-start">

						<div
							className="border rounded-xl bg-gray-50 p-6 flex flex-col items-center space-y-6 w-full max-w-xs">

							<div className="text-xs font-semibold text-gray-500 uppercase">
								Foto Siswa
							</div>

							<div className="relative w-40 h-40 sm:w-36 sm:h-36 md:w-40 md:h-40">

								{form.photo ? (
									<>
										<Image
											key={form.photo}
											src={buildUserImagePath ("Student", form.photo)}
											alt="Preview"
											fill
											className="object-cover rounded-full border-4 border-blue-500 bg-white shadow-sm"
											unoptimized
										/>

										<Button
											type="button"
											variant="ghost"
											color="secondary"
											iconOnly
											shape="circle"
											leftIcon={FiX}
											onClick={() => onChange ("photo", null)}
											className="absolute -top-2 -right-2"
										/>
									</>
								) : (
									<div
										className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm border">
										No Photo
									</div>
								)}

							</div>

							<UploadButton
								onUpload={handleUpload}
								hasImage={Boolean (form.photo)}
							/>

						</div>

					</div>

					{/* IDENTITAS SISWA */}

					<div className="md:col-span-3 space-y-6">

						<div className="text-sm font-semibold text-gray-600 uppercase">
							Identitas Siswa
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

							<TextField
								label="NIS"
								value={form.nis ?? ""}
								onChange={(e) =>
									onChange ("nis", e.target.value || null)
								}
							/>

							<TextField
								label="NISN"
								required
								value={form.nisn ?? ""}
								onChange={(e) =>
									onChange ("nisn", e.target.value)
								}
							/>

							<TextField
								label="Nama Lengkap"
								required
								value={form.name ?? ""}
								onChange={(e) =>
									onChange ("name", e.target.value)
								}
							/>

							<TextField
								label="Nama Panggilan"
								value={form.nickname ?? ""}
								onChange={(e) =>
									onChange ("nickname", e.target.value || null)
								}
							/>

							<SelectField
								name="gender"
								label="Jenis Kelamin"
								value={form.gender}
								onChange={(e) =>
									onChange ("gender", e.target.value as Gender)
								}
								error={fieldErrors.gender}
							>
								<option value={Gender.MALE}>Laki-laki</option>
								<option value={Gender.FEMALE}>Perempuan</option>
							</SelectField>
							<SelectField
								name="religionCode"
								label="Agama"
								value={form.religionCode}
								onChange={(e) =>
									onChange ("religionCode", e.target.value)
								}
								error={fieldErrors.religionCode}
							>
								<option value="">Pilih Agama</option>
								{religions.map ((religion) => (
									<option key={religion.kode} value={religion.kode}>
										{religion.name}
									</option>
								))}
							</SelectField>

						</div>
						<div className="flex gap-6 items-start mt-4">

							{/* SWITCH */}

							<div className="flex items-center gap-3 mt-6">

								<Switch
									name="Difabel"
									checked={form.isDifable}
									onChange={(checked) => {
										onChange ("isDifable", checked)

										if (!checked) {
											onChange ("difableNotes", null)
										}
									}}
								/>

								<span
									className={`text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
										form.isDifable ? "text-blue-600" : "text-gray-600"
									}`}
								>
										{form.isDifable ? "Difabel" : "Non Difabel"}
									</span>

							</div>

							{/* TEXTAREA */}

							{form.isDifable && (
								<div className="flex-1">
									<TextAreaField
										label="Catatan Difabel"
										value={form.difableNotes ?? ""}
										onChange={(e) =>
											onChange ("difableNotes", e.target.value)
										}
										rows={4}
										maxLengthValue={200}
										showCounter
									/>
								</div>
							)}

						</div>

					</div>

				</div>

				<Divider/>

				{/* DATA KELAHIRAN */}

				<div className="space-y-6">

					<div className="text-sm font-semibold text-gray-600 uppercase">
						Data Kelahiran
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

						<TextField
							name="birthPlace"
							label="Tempat Lahir"
							value={form.birthPlace}
							onChange={(e) =>
								onChange ("birthPlace", e.target.value)
							}
							error={fieldErrors.birthPlace}
						/>


						<TextField
							name="birthDate"
							label="Tanggal Lahir"
							type="date"
							value={
								form.birthDate
									? form.birthDate.toISOString ().split ("T")[0]
									: ""
							}
							onChange={(e) =>
								onChange (
									"birthDate",
									new Date (e.target.value)
								)
							}
							error={fieldErrors.birthDate}
						/>

						<TextField
							name="nik"
							label="NIK"
							value={form.nik ?? ""}
							onChange={(e) =>
								onChange ("nik", e.target.value)
							}
							error={fieldErrors.nik}
						/>

						<TextField
							name="kkNumber"
							label="No Kartu Keluarga"
							value={form.kkNumber ?? ""}
							onChange={(e) =>
								onChange ("kkNumber", e.target.value || null)
							}
							error={fieldErrors.kkNumber}
						/>

					</div>

				</div>

				<Divider/>

				{/* KONTAK SISWA */}

				<div className="space-y-6">
					<div className="text-sm font-semibold text-gray-600 uppercase">
						Data Kelahiran
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">

						{/* ALAMAT */}

						<div className="md:col-span-1">
							<TextAreaField
								name="address"
								label="Alamat"
								value={form.address ?? ""}
								error={fieldErrors?.address}
								onChange={(e) =>
									onChange ("address", e.target.value)
								}
								rows={6}
								maxLengthValue={200}
								showCounter
							/>
						</div>

						{/* FIELD KONTAK */}
						<div className="md:col-span-3">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

								<TextField
									name="phone"
									label="No Telepon"
									value={form.phone ?? ""}
									error={fieldErrors?.phone}
									onChange={(e) =>
										onChange ("phone", e.target.value)
									}
								/>

								<TextField
									name="email"
									label="Email"
									value={form.email ?? ""}
									error={fieldErrors?.email}
									onChange={(e) =>
										onChange ("email", e.target.value)
									}
								/>

								<TextField
									name="schoolOrigin"
									label="Asal Sekolah"
									value={form.schoolOrigin ?? ""}
									error={fieldErrors?.schoolOrigin}
									onChange={(e) =>
										onChange ("schoolOrigin", e.target.value)
									}
								/>

								<TextField
									name="graduationScore"
									label="Nilai Lulus"
									value={form.graduationScore ?? ""}
									error={fieldErrors?.graduationScore}
									onChange={(e) =>
										onChange (
											"graduationScore",
											e.target.value
												? Number (e.target.value)
												: null
										)
									}
								/>

								<TextField
									name="instagram"
									label="Instagram"
									value={form.instagram ?? ""}
									error={fieldErrors?.instagram}
									onChange={(e) =>
										onChange ("instagram", e.target.value)
									}
								/>

							</div>
						</div>

					</div>
				</div>
				<Divider/>

				{/* DATA Keluarga */}

				<div className="space-y-6">

					<div className="text-sm font-semibold text-gray-600 uppercase">
						Data Keluarga
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

						<SelectField
							label="Status Keluarga"
							value={form.familyStatus ?? ""}
							onChange={(e) =>
								onChange("familyStatus", e.target.value as FamilyStatus)
							}
						>
							<option value="">Pilih Status</option>
							<option value={FamilyStatus.COMPLETE}>Orang Tua Lengkap</option>
							<option value={FamilyStatus.SINGLE_FATHER}>Single Father</option>
							<option value={FamilyStatus.SINGLE_MOTHER}>Single Mother</option>
							<option value={FamilyStatus.ORPHAN}>Yatim / Piatu / Wali</option>
						</SelectField>

						<SelectField
							label="Tinggal Dengan"
							value={family.livingWith ?? ""}
							onChange={(e) =>
								onChange("family", (prev) => ({
									...ensureFamily(prev),
									livingWith: e.target.value
								}))
							}
						>
							<option value="">Pilih</option>
							<option value="Orang Tua">Orang Tua</option>
							<option value="Ayah">Ayah</option>
							<option value="Ibu">Ibu</option>
							<option value="Wali">Wali</option>
						</SelectField>

						<SelectField
							label="Status Kepemilikan Rumah"
							value={family.houseOwnership ?? ""}
							onChange={(e) =>
								onChange("family", (prev) => ({
									...ensureFamily(prev),
									houseOwnership: e.target.value as HouseOwnership
								}))
							}
						>

							<option value="">Pilih Status</option>
							<option value="OWNED">Milik Sendiri</option>
							<option value="RENT">Sewa</option>
							<option value="FAMILY">Rumah Keluarga</option>
							<option value="GOVERNMENT">Rumah Dinas</option>

						</SelectField>

						<TextField
							name="family.headOfFamilyName"
							label="Nama Kepala Keluarga"
							value={family.headOfFamilyName}
							onChange={(e) =>
								onChange("family", (prev) => ({
									...ensureFamily(prev),
									headOfFamilyName: e.target.value
								}))
							}
						/>

					</div>

					<div className="space-y-6">

						<div className="text-sm font-semibold text-gray-600 uppercase">
							Data Orang Tua / Wali
						</div>

						{/* AYAH */}
						{showFather && father && (
							<div className="border rounded-xl p-5 bg-gray-50">
								<div className="font-semibold mb-4 text-gray-800">
									Data Ayah
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<ReadOnlyField label="Nama" value={father.name} />
									<ReadOnlyField label="Email" value={father.email} />
									<ReadOnlyField label="No HP" value={father.phone} />
									<ReadOnlyField label="Pendidikan" value={father.education} />
									<ReadOnlyField label="Pekerjaan" value={father.job} />
									<ReadOnlyField label="Penghasilan" value={father.income} />
									<ReadOnlyField label="Agama" value={father.religionCode} />
									<ReadOnlyField label="Alamat" value={father.address} />
								</div>
							</div>
						)}

						{/* IBU */}
						{showMother && mother && (
							<div className="border rounded-xl p-5 bg-gray-50">
								<div className="font-semibold mb-4 text-gray-800">
									Data Ibu
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<ReadOnlyField label="Nama" value={mother.name} />
									<ReadOnlyField label="Email" value={mother.email} />
									<ReadOnlyField label="No HP" value={mother.phone} />
									<ReadOnlyField label="Pendidikan" value={mother.education} />
									<ReadOnlyField label="Pekerjaan" value={mother.job} />
									<ReadOnlyField label="Penghasilan" value={mother.income} />
									<ReadOnlyField label="Agama" value={mother.religionCode} />
									<ReadOnlyField label="Alamat" value={mother.address} />
								</div>
							</div>
						)}

						{/* WALI */}
						{showGuardian && guardian && (
							<div className="border rounded-xl p-5 bg-gray-50">
								<div className="font-semibold mb-4 text-gray-800">
									Data Wali
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<ReadOnlyField label="Nama" value={guardian.name} />
									<ReadOnlyField label="Email" value={guardian.email} />
									<ReadOnlyField label="No HP" value={guardian.phone} />
									<ReadOnlyField label="Pendidikan" value={guardian.education} />
									<ReadOnlyField label="Pekerjaan" value={guardian.job} />
									<ReadOnlyField label="Penghasilan" value={guardian.income} />
									<ReadOnlyField label="Agama" value={guardian.religionCode} />
									<ReadOnlyField label="Alamat" value={guardian.address} />
								</div>
							</div>
						)}

					</div>


					<div className="space-y-4">

						<div className="text-sm font-semibold text-gray-600 uppercase">
							File Dokumen Siswa
						</div>

						a<DocumentsUploader
							studentId={studentId}
							nisn={form.nisn}
							academicYear={academicYearName}
							value={family.documents ?? []}
							onUploadAction={handleUploadStudentDocument}
							onDeleteAction={handleDeleteStudentDocument}
							onChangeAction={(documents) => {
								onChange("family", (prev) => ({
									...ensureFamily(prev),
									documents: Array.from(new Set(documents))
								}));
							}}
						/>

					</div>
				</div>

				<Divider/>

				<div className="space-y-4">
					<div className="text-sm font-semibold text-gray-600 uppercase">
						Bantuan Siswa (KJP / PIP)
					</div>

					{student?.aids && student.aids.length > 0 ? (
						<div className="space-y-3">
							{student.aids.map((aid) => (
								<div
									key={aid.academicYearId}
									className="border rounded-lg p-4 bg-gray-50"
								>
									<div className="font-semibold text-gray-800 mb-3">
										Tahun Ajaran {aid.academicYear?.name}
									</div>

									<div className="flex gap-8">
										<Switch
											label="KJP"
											checked={aid.kjp}
											onChange={() => {}}
											disabled
											variant="success"
										/>

										<Switch
											label="PIP"
											checked={aid.pip}
											onChange={() => {}}
											disabled
											variant="info"
										/>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-sm text-gray-500">
							Tidak ada data bantuan.
						</div>
					)}
				</div>
			</div>
			<Divider/>
		</Modal>
	)
}

