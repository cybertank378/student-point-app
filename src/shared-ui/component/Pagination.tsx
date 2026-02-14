//Files: src/shared-ui/component/Pagination.tsx
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;

  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Showing {start} to {end} of {totalItems} entries
      </p>

      <div className="flex items-center gap-2">
        {/* PREV */}
        <Button
          shape="circle"
          size="sm"
          variant="outline"
          color="primary"
          iconOnly
          disabled={isPrevDisabled}
          onClick={() => onPageChangeAction(currentPage - 1)}
          className={clsx(
            "w-9 h-9 border",
            isPrevDisabled &&
              "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
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
                isActive && "shadow-md",
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
          onClick={() => onPageChangeAction(currentPage + 1)}
          className={clsx(
            "w-9 h-9 border",
            isNextDisabled &&
              "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
          )}
          rightIcon={FaChevronRight}
        />
      </div>
    </div>
  );
}
