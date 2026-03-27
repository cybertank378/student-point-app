//Files: src/sections/student/molecules/StudentViolationTab.tsx

"use client";

import ViolationRow, { type Violation } from "@/sections/student/atomic/ViolationRow";
import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@/shared-ui/component/Table";

interface Props {
  violations: Violation[];
}

export default function StudentViolationTab({ violations }: Props) {
  if (!violations || violations.length === 0) {
    return <div className="text-sm text-gray-500">Belum ada pelanggaran.</div>;
  }

  const totalPoint = violations.reduce((sum, v) => sum + v.point, 0);

  return (
    <div className="space-y-4">
      {/* SUMMARY */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Riwayat Pelanggaran</h3>

        <div className="text-sm font-medium text-red-600">Total Point: {totalPoint}</div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Nama</TableHeaderCell>
              <TableHeaderCell>Level</TableHeaderCell>
              <TableHeaderCell>Point </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {violations.map((v) => (
              <ViolationRow key={v.id} violation={v} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
