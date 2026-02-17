//Files: src/sections/violation/ViolationSection.tsx
"use client";

import { useViolationMasterApi } from "@/modules/violation/presentation/hooks/useViolationApi";
import ViolationHeader from "@/sections/violation/molecules/ViolationHeader";
import ViolationTabel from "@/sections/violation/organisms/ViolationTabel";

export default function ViolationSection() {
  const api = useViolationMasterApi();

  return (
    <div className="space-y-6">
      <ViolationHeader api={api} />
      <ViolationTabel api={api} />
    </div>
  );
}
