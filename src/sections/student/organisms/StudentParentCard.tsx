//Files: src/sections/student/organisms/StudentParentCard.tsx
// Files: src/sections/student/organisms/StudentParentCard.tsx
"use client";

import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {JSX} from "react";

interface Props {
  familyStatus: StudentCompositeDTO["familyStatus"];
  parents: StudentCompositeDTO["parents"];
}

export default function StudentParentCard({ familyStatus, parents }: Props) {
  const roleMap: Record<
      NonNullable<Props["familyStatus"]>,
      readonly ("FATHER" | "MOTHER" | "GUARDIAN")[]
  > = {
    COMPLETE: ["FATHER", "MOTHER"],
    SINGLE_MOTHER: ["MOTHER"],
    SINGLE_FATHER: ["FATHER"],
    ORPHAN: ["GUARDIAN"],
  };

  const titleMap = {
    FATHER: "Ayah",
    MOTHER: "Ibu",
    GUARDIAN: "Wali",
  } as const;

  const roles = familyStatus ? roleMap[familyStatus] : [];

  const parentCards = roles
      .map((role) => {
        const parent = parents.find((p) => p.role === role)?.parent;
        if (!parent) return null;

        return (
            <div key={role} className="border rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">
                {titleMap[role]}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Nama:</span> {parent.name}
                </div>

                <div>
                  <span className="font-medium">Telepon:</span> {parent.phone}
                </div>

                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {parent.email ?? "-"}
                </div>

                <div>
                  <span className="font-medium">Pendidikan:</span>{" "}
                  {parent.education}
                </div>

                <div>
                  <span className="font-medium">Pekerjaan:</span> {parent.job}
                </div>

                <div>
                  <span className="font-medium">Penghasilan:</span>{" "}
                  {parent.income ?? "-"}
                </div>

                <div>
                  <span className="font-medium">Alamat:</span> {parent.address}
                </div>
              </div>
            </div>
        );
      })
      .filter((v): v is JSX.Element => Boolean(v));

  if (parentCards.length === 0) {
    return (
        <div className="bg-white border rounded-xl shadow-sm p-4 text-sm text-gray-500">
          Data orang tua belum tersedia.
        </div>
    );
  }

  return (
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Informasi Orang Tua
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parentCards}
        </div>
      </div>
  );
}