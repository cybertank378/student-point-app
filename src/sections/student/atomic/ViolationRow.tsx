//Files: src/sections/student/atomic/ViolationRow.tsx

import { formatDateSlash } from "@/libs/DateUtils";
import type { ViolationLevel } from "@/libs/utils/enums";
import { TableCell, TableRow } from "@/shared-ui/component/Table";

export interface Violation {
  id: string;
  violationId: string;
  point: number;
  occurredAt: Date;
  violation: {
    name: string;
    level: ViolationLevel;
  };
}

interface Props {
  violation: Violation;
}

export default function ViolationRow({ violation }: Props) {
  return (
    <TableRow>
      <TableCell>{formatDateSlash(violation.occurredAt)}</TableCell>

      <TableCell className="font-mono text-xs text-gray-600">{violation.violation.name}</TableCell>
      <TableCell className="font-mono text-xs text-gray-600">{violation.violation.level}</TableCell>

      <TableCell className="font-semibold text-red-600">{violation.point}</TableCell>
    </TableRow>
  );
}
