//Files: src/sections/student/organisms/StudentProfileCard.tsx
"use client";

import Link from "next/link";
import { formatDateLongID } from "@/libs/DateUtils";
import { buildUserImagePath, formatGender, getDifableStatus, getInstagramUrl, getReligionName } from "@/libs/utils";
import { Row } from "@/libs/utils/Row";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import Avatar from "@/shared-ui/component/Avatar";
import Loading from "@/shared-ui/component/Loading";

interface Props {
  student: StudentCompositeDTO | null;
  loading?: boolean;
}

export default function StudentProfileCard({ student, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <Loading />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      {/* PROFILE HEADER */}
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar name={student.name} image={buildUserImagePath("Student", student.photo) ?? null} size="lg" />

        <h2 className="mt-4 text-lg font-semibold text-gray-800">{student.name}</h2>

        <p className="text-sm text-gray-500">NISN {student.nisn}</p>
      </div>

      {/* STATS */}

      <div className="border-t px-6 py-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Pelanggaran</p>

          <p className="font-semibold text-gray-800">{student.violations?.length ?? 0}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Prestasi</p>

          <p className="font-semibold text-gray-800">{student.achievements?.length ?? 0}</p>
        </div>
      </div>

      {/* DETAIL */}

      <div className="border-t px-6 py-4 space-y-3 text-sm">
        <Row label="NIS" value={student.nis} />

        <Row label="NISN" value={student.nisn} />

        <Row label="Panggilan" value={student.nickname} />

        <Row label="Jenis Kelamin" value={formatGender(student.gender)} />

        <Row label="Tempat Lahir" value={student.birthPlace} />

        <Row label="Tanggal Lahir" value={formatDateLongID(student.birthDate)} />

        <Row label="Agama" value={getReligionName(student.religionCode)} />

        <Row label="NIK" value={student.nik} />

        <Row label="No KK" value={student.kkNumber} />

        <Row label="Alamat" value={student.address} />

        <Row label="Asal Sekolah" value={student.schoolOrigin} />

        <Row label="Nilai Kelulusan" value={student.graduationScore} />

        <Row label="Phone" value={student.phone} />

        <Row label="Email" value={student.email} />

        <Row
          label="Instagram"
          value={
            student.instagram ? (
              <Link
                href={getInstagramUrl(student.instagram) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                @{student.instagram}
              </Link>
            ) : (
              "-"
            )
          }
        />

        <Row label="Status Keluarga" value={student.familyStatus} />

        <Row label="Disabilitas" value={getDifableStatus(student.isDifable)} />

        <Row label="Catatan Difabel" value={student.difableNotes ?? "-"} />
      </div>
    </div>
  );
}
