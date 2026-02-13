//Files: src/shared-ui/component/TextArea.tsx

import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormLabel from "@/shared-ui/component/Form/FormLabel";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
}

export default function TextArea({
                                     label,
                                     helperText,
                                     error,
                                     ...props
                                 }: Props) {
    return (
        <FormControl error={error}>
            {label && <FormLabel>{label}</FormLabel>}

            <textarea
                className={clsx(
                    "border rounded-lg p-3 text-sm outline-none",
                    error
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
                )}
                {...props}
            />

            {helperText && (
                <FormHelperText error={error}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}
