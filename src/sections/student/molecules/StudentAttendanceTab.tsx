//Files: src/sections/student/molecules/StudentAttendanceTab.tsx
// Files: src/sections/student/molecules/StudentAttendanceTab.tsx
"use client";

import idLocale from "@fullcalendar/core/locales/id";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useMemo, useState } from "react";
import { AttendanceStatus } from "@/libs/utils/enums";

import Checkbox from "@/shared-ui/component/Checkbox";

import "@/styles/fullcalendar.css";

interface Attendance {
  date: string | Date;
  status: AttendanceStatus;
  note: string | null;
}

interface Props {
  attendances: Attendance[];
}

export default function StudentAttendanceTab({ attendances }: Props) {
  const [filters, setFilters] = useState({
    ALPHA: true,
    SAKIT: true,
    IZIN: true,
  });

  const toggleFilter = (status: AttendanceStatus) => {
    setFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const filteredAttendances = useMemo(() => {
    return attendances.filter((a) => filters[a.status]);
  }, [attendances, filters]);

  const events = useMemo(() => {
    return filteredAttendances.map((a) => {
      let color = "";
      let textColor = "#fff";

      switch (a.status) {
        case AttendanceStatus.ALPHA:
          color = "#dc2626"; // red-600 (lebih kuat)
          textColor = "#ffffff";
          break;

        case AttendanceStatus.SAKIT:
          color = "#f59e0b"; // amber
          textColor = "#111827"; // gray-900 agar terbaca
          break;

        case AttendanceStatus.IZIN:
          color = "#2563eb"; // blue-600
          textColor = "#ffffff";
          break;
      }

      return {
        title: a.status,
        start: typeof a.date === "string" ? a.date : a.date.toISOString(),
        backgroundColor: color,
        borderColor: color,
        textColor: textColor,
      };
    });
  }, [filteredAttendances]);

  const alpha = attendances.filter((a) => a.status === AttendanceStatus.ALPHA).length;
  const sakit = attendances.filter((a) => a.status === AttendanceStatus.SAKIT).length;
  const izin = attendances.filter((a) => a.status === AttendanceStatus.IZIN).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-sm">
        {/* FILTER */}
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Filter Kehadiran</h3>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <Checkbox label="Alpha" checked={filters.ALPHA} onChange={() => toggleFilter(AttendanceStatus.ALPHA)} />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <Checkbox label="Sakit" checked={filters.SAKIT} onChange={() => toggleFilter(AttendanceStatus.SAKIT)} />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full" />
              <Checkbox label="Izin" checked={filters.IZIN} onChange={() => toggleFilter(AttendanceStatus.IZIN)} />
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="border rounded-lg p-4 text-center">
          <div className="text-gray-600">Alpha</div>
          <div className="text-red-600 font-semibold text-lg">{alpha}</div>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <div className="text-gray-600">Sakit</div>
          <div className="text-yellow-600 font-semibold text-lg">{sakit}</div>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <div className="text-gray-600">Izin</div>
          <div className="text-blue-600 font-semibold text-lg">{izin}</div>
        </div>
      </div>

      {/* MAIN CALENDAR */}
      <div className="bg-white border rounded-xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={idLocale}
          events={events}
          eventDisplay="list-item"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          buttonText={{
            today: "Hari Ini",
            month: "Bulan",
            week: "Minggu",
            day: "Hari",
          }}
          dayMaxEvents={3}
        />
      </div>
    </div>
  );
}
