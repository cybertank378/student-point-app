//Files: src/shared-ui/component/CheckboxGroup.tsx

import Checkbox from "@/shared-ui/component/Checkbox";

interface Props {
    options: { label: string; value: string }[];
    value?: string[];
    onChange?: (value: string[]) => void;
}

export default function CheckboxGroup({
                                          options,
                                          value = [],
                                          onChange,
                                      }: Props) {
    const handleChange = (val: string) => {
        if (!onChange) return;

        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {options.map((opt) => (
                <Checkbox
                    key={opt.value}
                    label={opt.label}
                    checked={value.includes(opt.value)}
                    onChange={() => handleChange(opt.value)}
                />
            ))}
        </div>
    );
}
