//Files: src/shared-ui/component/ReadOnlyField.tsx
interface Props {
	label: string;
	value?: string | number | null;
}

export default function ReadOnlyField({ label, value }: Props) {
	return (
		<div className="flex flex-col">
			<div className="text-xs text-gray-500">{label}</div>
			<div className="text-sm font-semibold text-gray-900">
				{value || "-"}
			</div>
		</div>
	);
}