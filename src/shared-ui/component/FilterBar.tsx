//Files: src/shared-ui/component/FilterBar.tsx

"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  resultCount?: number;
}

export default function FilterBar({ children, resultCount }: Props) {
  return (
    <div className="space-y-3">
      {/* FILTER CONTENT */}
      <div className="flex gap-4 items-end flex-wrap">{children}</div>

      {/* RESULT BADGE */}
      {typeof resultCount === "number" && (
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{resultCount}</span> hasil
          ditemukan
        </div>
      )}
    </div>
  );
}
