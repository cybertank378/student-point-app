"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "@/shared-ui/component/Button";
import clsx from "clsx";

type Props = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChangeAction: (page: number) => void;
};

export default function Pagination({
                                       currentPage,
                                       totalItems,
                                       itemsPerPage,
                                       onPageChangeAction,
                                   }: Props) {
    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / itemsPerPage)
    );

    const start =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const end = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

    return (
        <div className="w-full flex items-center justify-between py-2">
            {/* INFO */}
            <p className="text-sm text-gray-500">
                {totalItems === 0
                    ? "Tidak ada data"
                    : `Menampilkan ${start} hingga ${end} dari total ${totalItems} data`}
            </p>

            {/* CONTROLS */}
            <div className="flex items-center gap-2">
                {/* PREV */}
                <Button
                    shape="circle"
                    size="sm"
                    variant="outline"
                    color="primary"
                    iconOnly
                    disabled={isPrevDisabled}
                    onClick={() =>
                        !isPrevDisabled &&
                        onPageChangeAction(currentPage - 1)
                    }
                    className={clsx(
                        "w-9 h-9 border",
                        isPrevDisabled &&
                        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    )}
                    leftIcon={FaChevronLeft}
                />

                {/* PAGE NUMBERS */}
                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const isActive = currentPage === page;

                    return (
                        <Button
                            key={page}
                            shape="circle"
                            size="sm"
                            variant={isActive ? "filled" : "outline"}
                            color="primary"
                            onClick={() => onPageChangeAction(page)}
                            className={clsx(
                                "w-9 h-9 border text-sm font-medium",
                                isActive && "shadow-md"
                            )}
                        >
                            {page}
                        </Button>
                    );
                })}

                {/* NEXT */}
                <Button
                    shape="circle"
                    size="sm"
                    variant="outline"
                    color="primary"
                    iconOnly
                    disabled={isNextDisabled}
                    onClick={() =>
                        !isNextDisabled &&
                        onPageChangeAction(currentPage + 1)
                    }
                    className={clsx(
                        "w-9 h-9 border",
                        isNextDisabled &&
                        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    )}
                    rightIcon={FaChevronRight}
                />
            </div>
        </div>
    );
}
