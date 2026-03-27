//Files: src/sections/student/atomic/StudentPointRow.tsx

import { formatDateSlash, formatDateLongID } from "@/libs/DateUtils";
import { TableCell, TableRow } from "@/shared-ui/component/Table";

export interface StudentPoint {
  academicYearId: string;
  academicYear: {
    name: string;
  };
  totalViolationPoint: number;
  totalAchievementPoint: number;
  totalPoint: number;
  updatedAt: Date;
}

interface Props {
  point: StudentPoint;
}

export default function StudentPointRow({ point }: Props) {
  const statusColor = point.totalPoint >= 0 ? "text-green-600" : "text-red-600";

  return (
    <TableRow>
      <TableCell className="font-mono text-xs text-gray-600">{point.academicYear?.name ?? "-"}</TableCell>

      <TableCell className="text-red-600 font-semibold">{point.totalViolationPoint}</TableCell>

      <TableCell className="text-green-600 font-semibold">{point.totalAchievementPoint}</TableCell>

      <TableCell className={`font-bold ${statusColor}`}>{point.totalPoint}</TableCell>

      <TableCell>{formatDateSlash(point.updatedAt)}</TableCell>
    </TableRow>
  );
}
