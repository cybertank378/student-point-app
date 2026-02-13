//Files: src/shared-ui/component/Form/FormHelperText.tsx


import clsx from "clsx";

interface Props {
    children?: React.ReactNode;
    error?: boolean;
    success?: boolean;
    className?: string; // ✅ tambahkan ini
}

export default function FormHelperText({
                                           children,
                                           error,
                                           success,
                                           className,
                                       }: Props) {
    return (
        <p
            className={clsx(
                "text-xs mt-1",
                error && "text-red-500",
                success && "text-green-500",
                !error && !success && "text-gray-500",
                className // ✅ merge className
            )}
        >
            {children}
        </p>
    );
}
