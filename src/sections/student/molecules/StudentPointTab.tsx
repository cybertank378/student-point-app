//Files: src/sections/student/molecules/StudentPointTab.tsx
"use client";

import StudentPointRow, { type StudentPoint } from "@/sections/student/atomic/StudentPointRow";

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@/shared-ui/component/Table";

interface Props {
  points: StudentPoint[];
}

export default function StudentPointTab({ points }: Props) {
  if (!points || points.length === 0) {
    return <div className="text-sm text-gray-500">Belum ada data poin.</div>;
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Ringkasan Poin Disiplin</h3>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tahun Akademik</TableHeaderCell>
              <TableHeaderCell>Pelanggaran</TableHeaderCell>
              <TableHeaderCell>Prestasi</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>Diperbarui</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {points.map((p) => (
              <StudentPointRow key={p.academicYearId} point={p} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
