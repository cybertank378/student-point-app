// Files: src/shared-ui/component/Modal.tsx
"use client";

import clsx from "clsx";
import type { FC, ReactNode, MouseEvent } from "react";
import { useEffect } from "react";
import Button from "./Button";

interface ModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    submitText?: string;
    cancelText?: string;
    children: ReactNode;

    className?: string;
    titleClassName?: string;
    submitButtonClassName?: string;
    cancelButtonClassName?: string;

    size?: "sm" | "md" | "lg" | "xl";

    // 🔥 Tambahan agar fleksibel
    submitColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    cancelColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
};

export const Modal: FC<ModalProps> = ({
                                          title,
                                          open,
                                          onClose,
                                          onSubmit,
                                          submitText = "Save",
                                          cancelText = "Cancel",
                                          children,
                                          className,
                                          titleClassName,
                                          submitButtonClassName,
                                          cancelButtonClassName,
                                          size = "md",
                                          submitColor = "primary",
                                          cancelColor = "secondary",
                                      }) => {
    // Lock scroll body ketika modal terbuka
    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    if (!open) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={handleOverlayClick}
        >
            <div
                className={clsx(
                    "w-full rounded-2xl bg-white p-8 text-gray-900 shadow-xl",
                    "max-h-[90vh] overflow-y-auto",
                    sizeMap[size],
                    className
                )}
            >
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <h2
                        className={clsx(
                            "text-xl font-semibold text-gray-900",
                            titleClassName
                        )}
                    >
                        {title}
                    </h2>

                    <div className="flex items-center gap-3">
                        {/* Cancel Button */}
                        <Button
                            variant="outline"
                            color={cancelColor}
                            size="md"
                            className={cancelButtonClassName}
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>

                        {/* Submit Button */}
                        {onSubmit && (
                            <Button
                                variant="filled"
                                color={submitColor}
                                size="md"
                                className={submitButtonClassName}
                                onClick={onSubmit}
                            >
                                {submitText}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

