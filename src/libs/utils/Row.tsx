//Files: src/libs/utils/Row.tsx

export function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 text-right">{value ?? "-"}</span>
    </div>
  );
}
