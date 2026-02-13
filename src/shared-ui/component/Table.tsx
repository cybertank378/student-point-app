//src/shared/component/ui/Table.tsx
"use client";

import clsx from "clsx";
import type React from "react";

/* =========================
   TABLE CONTAINER (WRAPPER)
========================= */
type TableProps = {
    children: React.ReactNode;
    className?: string;          // untuk <table>
    wrapperClassName?: string;   // untuk div pembungkus
};

export const Table = ({
                          children,
                          className,
                          wrapperClassName,
                      }: TableProps) => (
    <div
        className={clsx(
            "overflow-x-auto border border-gray-200 bg-white",
            wrapperClassName
        )}
    >
        <table
            className={clsx(
                "w-full text-sm text-gray-700 border-separate border-spacing-0",
                className
            )}
        >
            {children}
        </table>
    </div>
);

/* =========================
   TABLE HEAD
========================= */
export const TableHead = ({
                              children,
                              className,
                          }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <thead
        className={clsx(
            "bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200",
            className
        )}
    >
    {children}
    </thead>
);

/* =========================
   HEADER CELL
========================= */
export const TableHeaderCell = ({
                                    children,
                                    className,
                                }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <th
        className={clsx(
            "px-4 py-3 text-left font-medium tracking-wide whitespace-nowrap",
            className
        )}
    >
        {children}
    </th>
);

/* =========================
   TABLE ROW
========================= */
export const TableRow = ({
                             children,
                             className,
                             ...props
                         }: React.HTMLAttributes<HTMLTableRowElement> & {
    children: React.ReactNode;
}) => (
    <tr
        className={clsx(
            "border-b border-gray-100 even:bg-gray-50",
            "hover:bg-indigo-50/60 transition-all duration-200",
            className
        )}
        {...props}
    >
        {children}
    </tr>
);

/* =========================
   TABLE CELL
========================= */
export const TableCell = ({
                              children,
                              className,
                              ...props
                          }: React.HTMLAttributes<HTMLTableCellElement> & {
    children: React.ReactNode;
}) => (
    <td
        className={clsx(
            "px-4 py-3 text-sm text-gray-700 align-middle whitespace-nowrap",
            className
        )}
        {...props}
    >
        {children}
    </td>
);
