//Files: src/sections/student/molecules/StudentInfoCard.tsx
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function StudentInfoCard({ title, children }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>

      <div className="space-y-2">{children}</div>
    </div>
  );
}
