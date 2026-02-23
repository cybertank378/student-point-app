"use client";

import { useState } from "react";
import Button from "@/shared-ui/component/Button";
import CheckboxGroup from "@/shared-ui/component/CheckboxGroup";
import Divider from "@/shared-ui/component/Divider";
import clsx from "clsx";
import { ReactNode } from "react";

type Direction = "vertical" | "horizontal";

export interface BulkOption<T extends string> {
    label: string;
    value: T;
}

interface BulkPanel<T extends string> {
    key: string;
    toggleText: string;
    confirmText: string;
    cancelText?: string;
    options: BulkOption<T>[];
    direction?: Direction;
    onConfirm: (values: T[]) => void;
    confirmColor?: "primary" | "info" | "success" | "warning" | "error";
}

interface BulkActionBarProps {
    count: number;
    label?: string;

    primaryText?: string;
    onPrimaryClick?: () => void;
    primaryLoading?: boolean;

    panels?: BulkPanel<any>[]; // dynamic panels

    onClear: () => void;

    children?: ReactNode;
    className?: string;
}

export default function BulkActionBar({
                                          count,
                                          label = "selected",
                                          primaryText,
                                          onPrimaryClick,
                                          primaryLoading = false,
                                          panels = [],
                                          onClear,
                                          children,
                                          className,
                                      }: BulkActionBarProps) {
    const [activePanelKey, setActivePanelKey] = useState<string | null>(null);
    const [panelSelections, setPanelSelections] = useState<
        Record<string, string[]>
    >({});

    if (count === 0) return null;

    const activePanel = panels.find((p) => p.key === activePanelKey);

    const handleConfirm = () => {
        if (!activePanel) return;

        const values = panelSelections[activePanel.key] ?? [];
        if (values.length === 0) return;

        activePanel.onConfirm(values);
        setPanelSelections((prev) => ({
            ...prev,
            [activePanel.key]: [],
        }));
        setActivePanelKey(null);
    };

    return (
        <div
            className={clsx(
                `
                bg-white
                border border-gray-200
                rounded-xl
                px-6 py-4
                shadow-lg
                backdrop-blur-sm
                transition-all
                `,
                className
            )}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {count}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {count} {label}
                        </p>
                        <p className="text-xs text-gray-500">
                            Bulk actions available
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {children}

                    {panels.map((panel) => (
                        <Button
                            key={panel.key}
                            color="info"
                            variant="outline"
                            onClick={() =>
                                setActivePanelKey((prev) =>
                                    prev === panel.key ? null : panel.key
                                )
                            }
                        >
                            {panel.toggleText}
                        </Button>
                    ))}

                    {primaryText && onPrimaryClick && (
                        <Button
                            color="primary"
                            variant="filled"
                            loading={primaryLoading}
                            onClick={onPrimaryClick}
                        >
                            {primaryText}
                        </Button>
                    )}

                    <Button
                        color="secondary"
                        variant="text"
                        onClick={onClear}
                    >
                        Clear
                    </Button>
                </div>
            </div>

            {/* DYNAMIC PANEL */}
            {activePanel && (
                <>
                    <Divider spacing="md" />

                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <CheckboxGroup
                                options={activePanel.options}
                                value={
                                    panelSelections[activePanel.key] ?? []
                                }
                                onChange={(vals) =>
                                    setPanelSelections((prev) => ({
                                        ...prev,
                                        [activePanel.key]: vals,
                                    }))
                                }
                                direction={
                                    activePanel.direction ?? "horizontal"
                                }
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <Button
                                color="secondary"
                                variant="text"
                                onClick={() => {
                                    setActivePanelKey(null);
                                }}
                            >
                                {activePanel.cancelText ?? "Cancel"}
                            </Button>

                            <Button
                                color={
                                    activePanel.confirmColor ?? "primary"
                                }
                                variant="filled"
                                disabled={
                                    !(
                                        panelSelections[
                                            activePanel.key
                                            ]?.length > 0
                                    )
                                }
                                onClick={handleConfirm}
                            >
                                {activePanel.confirmText}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}