//Files: src/shared-ui/component/Form/FormControl.tsx
import {ReactNode} from "react";
import clsx from "clsx";

interface Props {
    children: ReactNode;
    error?: boolean;
    success?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function FormControl({
                                        children,
                                        error,
                                        success,
                                        disabled,
                                        className,
                                    }: Props) {
    return (
        <div
            className={clsx(
                "flex flex-col gap-1",
                disabled && "opacity-60",
                className
            )}
        >
            {children}
        </div>
    );
}
