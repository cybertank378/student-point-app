//Files: src/modules/student-family-info/presentation/hooks/useStudentFamilyInfoApi.ts

"use client";

import {useCallback, useState} from "react";

import {
	parseError,
	safeJson,
	toApiError,
	type ApiError
} from "@/modules/shared/errors/ApiError";
import {StudentFamilyInfoResponse} from "@/modules/student-family-info/domain/dto/StudentFamilyInfoResponse";

export const useStudentFamilyInfoApi = () => {

	const [loading, setLoading] = useState (false);
	const [error, setError] = useState<ApiError | null> (null);

	/* ============================================================
	 * GET FAMILY INFO
	 * ============================================================ */

	const getFamilyInfo = useCallback (async (studentId: string) => {

		try {

			setError (null);

			const res = await fetch (`/api/students/${studentId}/family-info`);

			if (!res.ok) {
				const apiErr = await parseError (res);
				setError (apiErr);
				return null;
			}

			return await safeJson (res);

		} catch (err) {

			const apiErr = toApiError (err, "Gagal mengambil data keluarga siswa.");
			setError (apiErr);
			return null;

		}

	}, []);

	/* ============================================================
	 * CREATE FAMILY INFO
	 * ============================================================ */

	const createFamilyInfo = useCallback (async (studentId: string, payload: any) => {

		try {

			setError (null);

			const res = await fetch (`/api/students/${studentId}/family-info`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify (payload)
			});

			if (!res.ok) {
				const apiErr = await parseError (res);
				setError (apiErr);
				return null;
			}

			return await safeJson (res);

		} catch (err) {

			const apiErr = toApiError (err, "Gagal menambahkan data keluarga siswa.");
			setError (apiErr);
			return null;

		}

	}, []);

	/* ============================================================
	 * UPDATE FAMILY INFO
	 * ============================================================ */

	const updateFamilyInfo = useCallback (async (studentId: string, payload: any) => {

		try {

			setError (null);

			const res = await fetch (`/api/students/${studentId}/family-info`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify (payload)
			});

			if (!res.ok) {
				const apiErr = await parseError (res);
				setError (apiErr);
				return null;
			}

			return await safeJson (res);

		} catch (err) {

			const apiErr = toApiError (err, "Gagal memperbarui data keluarga siswa.");
			setError (apiErr);
			return null;

		}

	}, []);

	/* ============================================================
	 * DELETE FAMILY INFO
	 * ============================================================ */

	const deleteFamilyInfo = useCallback (async (studentId: string) => {

		try {

			setError (null);

			const res = await fetch (`/api/students/${studentId}/family-info`, {
				method: "DELETE"
			});

			if (!res.ok) {
				const apiErr = await parseError (res);
				setError (apiErr);
				return false;
			}

			return true;

		} catch (err) {

			const apiErr = toApiError (err, "Gagal menghapus data keluarga siswa.");
			setError (apiErr);
			return false;

		}

	}, []);

	/* ============================================================
	 * UPLOAD FAMILY CARD
	 * ============================================================ */

	const uploadStudentDocument = useCallback(
		async (
			studentId: string,
			file: File,
			nisn: string,
			academicYear: string
		): Promise<{
			data: { fileUrl: string } | null;
			error: ApiError | null;
		}> => {
			setLoading(true);
			setError(null);

			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("nisn", nisn);
				formData.append("academicYear", academicYear);

				const res = await fetch(
					`/api/students/${studentId}/family-info/upload`,
					{
						method: "POST",
						body: formData
					}
				);

				const result = await res.json();

				if (!res.ok) {
					const apiErr = {
						message: result?.error?.message ?? "Upload gagal",
						statusCode: res.status
					};

					setError(apiErr);

					return {
						data: null,
						error: apiErr
					};
				}

				// API sudah return fileUrl langsung
				return {
					data: result.data,
					error: null
				};

			} catch (err) {
				const apiError = toApiError(
					err,
					"Gagal mengupload dokumen siswa."
				);

				setError(apiError);

				return {
					data: null,
					error: apiError
				};
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	/* ============================================================
	 * DELETE STUDENT DOCUMENT
	 * ============================================================ */

	const deleteStudentDocument = useCallback(
		async (
			studentId: string,
			filePath: string
		): Promise<{
			success: boolean;
			error?: ApiError | null;
		}> => {

			try {

				setError(null);

				const res = await fetch(
					`/api/students/${studentId}/family-info/document`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ filePath })
					}
				);

				if (!res.ok) {
					const apiErr = await parseError(res);
					setError(apiErr);
					return {
						success: false,
						error: apiErr
					};
				}

				return {
					success: true
				};

			} catch (err) {

				const apiErr = toApiError(
					err,
					"Gagal menghapus dokumen siswa."
				);

				setError(apiErr);

				return {
					success: false,
					error: apiErr
				};
			}

		},
		[]
	);


	return {

		loading,
		error,

		getFamilyInfo,
		createFamilyInfo,
		updateFamilyInfo,
		deleteFamilyInfo,
		uploadStudentDocument,
		deleteStudentDocument

	};

};