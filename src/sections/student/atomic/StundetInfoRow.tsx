//Files: src/sections/student/atomic/StundetInfoRow.tsx
interface Props {
  label: string;
  value?: string | number | boolean | null;
}

export default function StudentInfoRow({ label, value }: Props) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>

      <span className="text-gray-800">{value === null || value === undefined || value === "" ? "-" : String(value)}</span>
    </div>
  );
}
