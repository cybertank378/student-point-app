//Files: src/sections/student/molecules/AttendanceStats.tsx
"use client";

import { AttendanceStatus } from "@/libs/utils/enums";

interface Attendance {
  status: AttendanceStatus;
}

interface Props {
  attendances: Attendance[];
}

export default function AttendanceStats({ attendances }: Props) {
  const alpha = attendances.filter((a) => a.status === AttendanceStatus.ALPHA).length;
  const sakit = attendances.filter((a) => a.status === AttendanceStatus.SAKIT).length;
  const izin = attendances.filter((a) => a.status === AttendanceStatus.IZIN).length;

  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="p-3 border rounded-lg text-center">
        <div className="text-gray-500">Alpha</div>
        <div className="text-red-600 font-semibold">{alpha}</div>
      </div>

      <div className="p-3 border rounded-lg text-center">
        <div className="text-gray-500">Sakit</div>
        <div className="text-yellow-600 font-semibold">{sakit}</div>
      </div>

      <div className="p-3 border rounded-lg text-center">
        <div className="text-gray-500">Izin</div>
        <div className="text-blue-600 font-semibold">{izin}</div>
      </div>
    </div>
  );
}
