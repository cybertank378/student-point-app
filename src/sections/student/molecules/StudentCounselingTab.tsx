//Files: src/sections/student/molecules/StudentCounselingTab.tsx

"use client";

import { formatDateSlash } from "@/libs/DateUtils";
import type { CaseSource, CaseStatus } from "@/libs/utils/enums";

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/shared-ui/component/Table";

interface CounselingCase {
  id: string;
  academicYearId: string;
  academicYear?: {
    name?: string;
  };
  reason: string;
  source: CaseSource;
  status: CaseStatus;
  openedAt: Date;
  closedAt?: Date | null;
}

interface StudentCounselingTabProps {
  counselingCases?: CounselingCase[];
}

function getStatusBadge(status: CaseStatus) {
  switch (status) {
    case "OPEN":
      return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">OPEN</span>;

    case "CLOSED":
      return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">CLOSED</span>;

    default:
      return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">{status}</span>;
  }
}

function getSourceLabel(source: CaseSource) {
  switch (source) {
    case "SELF_REPORT":
      return "Laporan Siswa";

    case "TEACHER_REPORT":
      return "Laporan Guru";

    case "PARENT_REPORT":
      return "Laporan Orang Tua";

    default:
      return source;
  }
}

export default function StudentCounselingTab({ counselingCases }: StudentCounselingTabProps) {
  if (!counselingCases || counselingCases.length === 0) {
    return <div className="text-sm text-muted-foreground text-slate-600">Tidak ada data konseling.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tahun Ajaran</TableHeaderCell>
            <TableHeaderCell>Sumber</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Dibuka</TableHeaderCell>
            <TableHeaderCell>Ditutup</TableHeaderCell>
            <TableHeaderCell>Alasan Konseling</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {counselingCases.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
              <TableCell className="font-medium">{item.academicYear?.name ?? "-"}</TableCell>

              <TableCell>{getSourceLabel(item.source)}</TableCell>

              <TableCell>{getStatusBadge(item.status)}</TableCell>

              <TableCell>{formatDateSlash(item.openedAt)}</TableCell>

              <TableCell>{item.closedAt ? formatDateSlash(item.closedAt) : "-"}</TableCell>

              <TableCell className="max-w-md truncate">{item.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
