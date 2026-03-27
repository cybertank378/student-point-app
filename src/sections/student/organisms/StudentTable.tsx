// src/sections/student/organisms/StudentTable.tsx
// src/sections/student/organisms/StudentTable.tsx
"use client";

import {useEffect, useState} from "react";
import {FaEye, FaPenToSquare, FaTrash} from "react-icons/fa6";
import {useRouter} from "next/navigation";

import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow} from "@/shared-ui/component/Table";

import Pagination from "@/shared-ui/component/Pagination";
import Loading from "@/shared-ui/component/Loading";
import {Modal} from "@/shared-ui/component/Modal";

import Avatar from "@/shared-ui/component/Avatar";
import Button from "@/shared-ui/component/Button";
import Checkbox from "@/shared-ui/component/Checkbox";

import {showErrorToast, showSuccessToast} from "@/shared-ui/component/Toast";
import StudentFormModal from "@/sections/student/molecules/StudentFormModal";
import {useStudentApi} from "@/modules/student/presentation/hooks/useStudentApi";
import type {StudentCompositeDTO} from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type {StudentFormType} from "@/modules/student/domain/types/StudentFormType";
import type {UpdateStudentDTO} from "@/modules/student/domain/dto/UpdateStudentDTO";
import {mapStudentToForm} from "@/modules/student/presentation/utils/mapStudentToForm";
import {useSessionStorage} from "@/modules/student/presentation/hooks/useSessionStorage";
import {buildDynamicPatch} from "@/modules/shared/utils/buildDynamicPatch";
import {buildUserImagePath, formatClassLabel, formatGender, getDifableStatus, getReligionName} from "@/libs/utils";

interface Props {
	api: ReturnType<typeof useStudentApi>;
}

export default function StudentTable ({api}: Props) {

	const router = useRouter ();

	const {save, remove} = useSessionStorage ("studentId");

	const {
		students,
		fetchStudents,
		getStudentById,
		updateStudent,
		deleteStudent,
		loading
	} = api;

	/* ================= PAGINATION ================= */

	const [currentPage, setCurrentPage] = useState (1);
	const [itemsPerPage] = useState (10);
	const [totalItems, setTotalItems] = useState (0);

	/* ================= MODAL STATE ================= */

	const [editOpen, setEditOpen] = useState (false);
	const [editingId, setEditingId] = useState<string | null> (null);
	const [editingStudent, setEditingStudent] = useState<StudentCompositeDTO | null> (null);
	const [deleteId, setDeleteId] = useState<string | null> (null);
	const [formLoading, setFormLoading] = useState (false);
	const [selectedIds, setSelectedIds] = useState<string[]> ([]);

	/* ================= FORM STATE ================= */

	const [form, setForm] = useState<StudentFormType | null> (null);
	const [originalStudent, setOriginalStudent] = useState<StudentFormType | null> (null);

	/* ================= FETCH LIST ================= */

	useEffect (() => {
		const load = async () => {
			const result = await fetchStudents ({
				page: currentPage,
				limit: itemsPerPage
			});
			if (result) {
				setTotalItems (result.total);
			}
		};
		void load ();
	}, [currentPage, itemsPerPage, fetchStudents]);

	/* ================= ROW SELECTION ================= */

	const toggleSelect = (id: string) => {
		setSelectedIds ((prev) =>
			prev.includes (id)
				? prev.filter ((item) => item !== id)
				: [...prev, id]
		);
	};

	const handleSelectAll = () => {
		const currentPageIds = students.map ((s) => s.id);
		const allSelected = currentPageIds.every ((id) =>
			selectedIds.includes (id)
		);
		setSelectedIds (
			allSelected
				? selectedIds.filter ((id) => !currentPageIds.includes (id))
				: [...new Set ([...selectedIds, ...currentPageIds])]
		);

	};

	/* ================= HANDLE EDIT ================= */

	const handleEdit = async (id: string) => {
		setFormLoading (true);
		const detail = await getStudentById (id);
		if (!detail) {
			showErrorToast ("Gagal mengambil data siswa.");
			setFormLoading (false);
			return;
		}

		const mapped = mapStudentToForm (detail);
		setForm (mapped);
		setOriginalStudent (mapped);
		setEditingStudent (detail);
		setEditingId (id);
		setEditOpen (true);
		setFormLoading (false);

	};

	/* ================= CHANGE ================= */

	const handleChange = <K extends keyof StudentFormType>(
		field: K,
		value:
			| StudentFormType[K]
			| ((prev: StudentFormType[K]) => StudentFormType[K])
	) => {
		setForm((prev) => {
			if (!prev) return prev;

			const newValue =
				typeof value === "function"
					? (value as (p: StudentFormType[K]) => StudentFormType[K])(prev[field])
					: value;

			return {
				...prev,
				[field]: newValue
			};
		});
	};

	/* ================= UPDATE ================= */

	const handleSubmit = async () => {
		if (!editingId || !form || !originalStudent) return;
		try {
			const payload = buildDynamicPatch (
				editingId,
				form,
				originalStudent
			) as UpdateStudentDTO;
			const result = await updateStudent (payload);
			console.log("data ", result);
			if (!result) {
				showErrorToast ("Gagal memperbarui siswa.");
				return;
			}
			showSuccessToast ("Data siswa berhasil diperbarui");
			setEditOpen (false);
			setEditingId (null);
			setEditingStudent (null);
			setOriginalStudent (null);
			await fetchStudents ({
				page: currentPage,
				limit: itemsPerPage
			});
		} catch (err) {
			showErrorToast (
				err instanceof Error
					? err.message
					: "Terjadi kesalahan."
			);
		}
	};

	/* ================= DELETE ================= */

	const handleDelete = async () => {
		if (!deleteId) return;
		const success = await deleteStudent (deleteId);
		if (success) {
			showSuccessToast ("Data siswa berhasil dihapus.");
			setDeleteId (null);
			await fetchStudents ({
				page: currentPage,
				limit: itemsPerPage
			});
		} else {
			showErrorToast ("Gagal menghapus data siswa.");
		}
	};

	/* ================= VIEW ================= */

	const handleView = (id: string) => {
		if (!id) return;
		remove ();
		save (id);
		router.push ("/dashboard/students/details");
	};

	/* ================= RENDER ================= */

	return (
		<>
			<div className="bg-white border shadow-sm overflow-hidden">

				<Table>

					<TableHead>

						<TableRow>

							<TableHeaderCell>
								<Checkbox
									checked={
										students.length > 0 &&
										students.every ((s) =>
											selectedIds.includes (s.id)
										)
									}
									onChange={handleSelectAll}
								/>
							</TableHeaderCell>

							<TableHeaderCell>Nama</TableHeaderCell>
							<TableHeaderCell>NISN</TableHeaderCell>
							<TableHeaderCell>Gender</TableHeaderCell>
							<TableHeaderCell>Agama</TableHeaderCell>
							<TableHeaderCell>Difabel</TableHeaderCell>
							<TableHeaderCell>Kelas</TableHeaderCell>
							<TableHeaderCell>Tahun Ajaran</TableHeaderCell>
							<TableHeaderCell>Aksi</TableHeaderCell>

						</TableRow>

					</TableHead>

					<TableBody>

						{loading ? (

							<TableRow>

								<td colSpan={8}>
									<Loading/>
								</td>

							</TableRow>

						) : students.length === 0 ? (

							<TableRow>

								<td colSpan={8} className="text-center py-6 text-gray-400">
									Tidak ada data siswa.
								</td>

							</TableRow>

						) : (

							students.map ((student) => (

								<TableRow key={student.id}>

									<TableCell>

										<Checkbox
											checked={selectedIds.includes (student.id)}
											onChange={() => toggleSelect (student.id)}
										/>

									</TableCell>

									<TableCell>

										<div className="flex items-center gap-3">

											<Avatar
												name={student.name}
												image={
													buildUserImagePath (
														"Student",
														student.photo
													) ?? null
												}
												size="sm"
											/>

											<div>

												<p className="font-medium">{student.name}</p>

												<p className="text-xs text-gray-500">
													NIS: {student.nis}
												</p>

											</div>

										</div>

									</TableCell>

									<TableCell>{student.nisn}</TableCell>

									<TableCell>
										{formatGender (student.gender)}
									</TableCell>

									<TableCell>
										{getReligionName (student.religionCode)}
									</TableCell>

									<TableCell>
										{getDifableStatus (student.isDifable)}
									</TableCell>

									<TableCell>

										{formatClassLabel (
											student.enrollment?.grade,
											student.enrollment?.className
										)}

									</TableCell>

									<TableCell>
										{student.enrollment?.academicYearName}
									</TableCell>

									<TableCell>

										<div className="flex gap-2">

											<Button
												size="sm"
												iconOnly
												shape="circle"
												color="info"
												leftIcon={FaEye}
												onClick={() => handleView (student.id)}
											/>

											<Button
												size="sm"
												iconOnly
												shape="circle"
												leftIcon={FaPenToSquare}
												onClick={() => handleEdit (student.id)}
											/>

											<Button
												size="sm"
												iconOnly
												shape="circle"
												color="error"
												leftIcon={FaTrash}
												onClick={() => setDeleteId (student.id)}
											/>

										</div>

									</TableCell>

								</TableRow>

							))

						)}

					</TableBody>

				</Table>

				<div className="flex justify-end px-6 py-4 border-t">

					<Pagination
						currentPage={currentPage}
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						onPageChangeAction={setCurrentPage}
					/>

				</div>

			</div>

			{/* EDIT MODAL */}

			{form && (
				<StudentFormModal
					open={editOpen}
					student={editingStudent}
					onClose={() => {
						setEditOpen (false);
						setEditingId (null);
						setEditingStudent (null);
					}}
					onSubmit={handleSubmit}
					mode="edit"
					form={form}
					onChange={handleChange}
					loading={formLoading}
				/>
			)}

			{/* DELETE MODAL */}

			<Modal
				title="Konfirmasi Hapus"
				subtitle="Tindakan ini tidak dapat dibatalkan."
				open={Boolean (deleteId)}
				onClose={() => setDeleteId (null)}
				onSubmit={handleDelete}
				submitText="Hapus"
				submitColor="error"
				size="sm"
			>
				<p className="text-sm text-gray-600 text-center">
					Data siswa akan dihapus permanen.
				</p>
			</Modal>
		</>
	);

}
