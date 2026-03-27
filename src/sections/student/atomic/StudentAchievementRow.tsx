//Files: src/sections/student/atomic/StudentAchievementRow.ts

"use client";

import { formatDateSlash, formatDateLongID } from "@/libs/DateUtils";
import { TableCell, TableRow } from "@/shared-ui/component/Table";

export interface StudentAchievement {
  id: string;
  academicYearId: string;

  academicYear: {
    name: string;
  };

  point: number;

  achievedAt: Date | string;
}

interface Props {
  achievement: StudentAchievement;
}

export default function StudentAchievementRow({ achievement }: Props) {
  return (
    <TableRow>
      <TableCell>{formatDateSlash(achievement.achievedAt)}</TableCell>
      <TableCell className="font-semibold text-indigo-600">{achievement.point}</TableCell>
      <TableCell className="font-mono text-xs text-gray-600">{achievement.academicYear?.name ?? "-"}</TableCell>
    </TableRow>
  );
}
