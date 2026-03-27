"use client";

import { formatClassLabel } from "@/libs/utils";
import { useRombelApi } from "@/modules/rombel/presentation/hooks/useRombelApi";

import type { StudentFilterUI } from "@/modules/student/domain/types/StudentFilterUI";

import SelectField from "@/shared-ui/component/SelectField";

import { EnrollmentStatus } from "@/libs/utils/enums";
import {useStudentApi} from "@/modules/student/presentation/hooks/useStudentApi";

interface Props {
  api: ReturnType<typeof useStudentApi>;
  filters: StudentFilterUI;
  setFilters: React.Dispatch<React.SetStateAction<StudentFilterUI>>;
}

export default function StudentHeader({ api }: Props) {

  const { rombels } = useRombelApi(true);

  /* =====================================================
   FILTER CHANGE
   ===================================================== */

  const handleFilterChange = <K extends keyof StudentFilterUI>(
      field: K,
      value: StudentFilterUI[K]
  ) => {

    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));

  };

  /* =====================================================
   RESET FILTER
   ===================================================== */

  const resetFilters = () => {

    setFilters({
      search: "",
      classId: "",
      isDifable: "",
      status: ""
    });

  };

  return (

      <div className="bg-transparent overflow-hidden">

        <div className="px-8 py-6 space-y-6">

          <div className="flex items-center justify-between">

            <h3 className="text-base font-semibold text-gray-700">
              Filters
            </h3>

            <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>

          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* CLASS FILTER */}

            <SelectField
                value={filters.classId}
                onChange={(e) =>
                    handleFilterChange("classId", e.target.value)
                }
            >

              <option value="">Pilih Kelas</option>

              {rombels.map((r) => (
                  <option key={r.id} value={r.id}>
                    {formatClassLabel(r.grade, r.name)}
                  </option>
              ))}

            </SelectField>

            {/* DIFABLE FILTER */}

            <SelectField
                value={filters.isDifable}
                onChange={(e) =>
                    handleFilterChange(
                        "isDifable",
                        e.target.value as "" | "true" | "false"
                    )
                }
            >

              <option value="">Semua Status Difabel</option>
              <option value="true">Difabel</option>
              <option value="false">Non-Difabel</option>

            </SelectField>

            {/* STATUS FILTER */}

            <SelectField
                value={filters.status}
                onChange={(e) =>
                    handleFilterChange(
                        "status",
                        e.target.value as "" | EnrollmentStatus
                    )
                }
            >

              <option value="">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="PROMOTED">Naik Kelas</option>
              <option value="REPEATED">Mengulang</option>
              <option value="DROPPED">Keluar</option>
              <option value="GRADUATED">Lulus</option>

            </SelectField>

          </div>

        </div>

      </div>

  );
}