//Files: src/modules/student-family-info/infrastructure/repo/StudentFamilyInfoRepository.ts
import prisma from "@/libs/prisma";

import {
	StudentFamilyInfoInterface
} from "@/modules/student-family-info/domain/interfaces/StudentFamilyInfoInterface";

import {
	StudentFamilyInfo
} from "@/modules/student-family-info/domain/entity/StudentFamilyInfo";

import {
	DeleteStudentFamilyInfoDTO
} from "@/modules/student-family-info/domain/dto/DeleteStudentFamilyInfoDTO";
import {CreateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/CreateStudentFamilyInfoDTO";
import {UpdateStudentFamilyInfoDTO} from "@/modules/student-family-info/domain/dto/UpdateStudentFamilyInfoDTO";


export class StudentFamilyInfoRepository implements StudentFamilyInfoInterface {

	async create(
		data: CreateStudentFamilyInfoDTO
	): Promise<StudentFamilyInfo> {

		return prisma.studentFamilyInfo.create({
			data: {
				...data,
				documents: data.documents ?? []
			}
		});

	}

	async update(entity: StudentFamilyInfo): Promise<StudentFamilyInfo> {
		return prisma.studentFamilyInfo.update({
			where: { studentId: entity.studentId },
			data: {
				livingWith: entity.livingWith,
				houseOwnership: entity.houseOwnership,
				headOfFamilyName: entity.headOfFamilyName,
				familyCardAddress: entity.familyCardAddress,
				// ❗ jangan update documents di sini
			}
		});
	}


	async delete(
		payload: DeleteStudentFamilyInfoDTO
	): Promise<void> {

		await prisma.studentFamilyInfo.delete({
			where: { studentId: payload.studentId }
		});

	}

	async findByStudentId(
		studentId: string
	): Promise<StudentFamilyInfo | null> {

		return prisma.studentFamilyInfo.findUnique({
			where: { studentId }
		});

	}

	async addDocument(studentId: string, filePath: string): Promise<void> {

		const data = await prisma.studentFamilyInfo.findUnique({
			where: { studentId },
			select: { documents: true }
		});

		if (!data) {
			throw new Error("Student family info not found");
		}

		const updated = Array.from(
			new Set([...(data.documents ?? []), filePath])
		);

		await prisma.studentFamilyInfo.update({
			where: { studentId },
			data: {
				documents: updated
			}
		});
	}

	async removeDocument(studentId: string, filePath: string): Promise<void> {

		const data = await prisma.studentFamilyInfo.findUnique({
			where: { studentId },
			select: { documents: true }
		});

		if (!data) {
			throw new Error("Student family info not found");
		}

		const updated =
			data.documents.filter(doc => doc !== filePath);

		await prisma.studentFamilyInfo.update({
			where: { studentId },
			data: {
				documents: updated
			}
		});
	}

	async getDocuments(studentId: string): Promise<string[]> {
		const data = await prisma.studentFamilyInfo.findUnique({
			where: { studentId },
			select: { documents: true }
		});

		return data?.documents ?? [];
	}
}