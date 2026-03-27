//Files: src/sections/student/molecules/StudentAchievementTab.tsx
"use client";

import StudentAchievementRow, { type StudentAchievement } from "@/sections/student/atomic/StudentAchievementRow";

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@/shared-ui/component/Table";

interface Props {
  achievements: StudentAchievement[];
}

export default function StudentAchievementTab({ achievements }: Props) {
  if (!achievements || achievements.length === 0) {
    return <div className="text-sm text-gray-500">Belum ada data prestasi.</div>;
  }

  const totalPoint = achievements.reduce((sum, a) => sum + a.point, 0);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Riwayat Prestasi</h3>

        <div className="text-sm font-medium text-indigo-600">Total Point: {totalPoint}</div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tahun Akademik</TableHeaderCell>
              <TableHeaderCell>Point</TableHeaderCell>
              <TableHeaderCell>Tanggal</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {achievements.map((a) => (
              <StudentAchievementRow key={a.id} achievement={a} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
