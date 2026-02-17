// Files: src/shared-ui/component/SearchField.tsx
"use client";

import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Button from "@/shared-ui/component/Button";
import clsx from "clsx";

type Size = "sm" | "md" | "lg";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: Size;
  debounce?: number;
  autoFocus?: boolean;
  className?: string;
}

const sizeMap: Record<Size, string> = {
    sm: "h-9 text-sm",
    md: "h-11 text-sm", // 🔥 samakan dengan TextField
    lg: "h-12 text-base",
};

export default function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  size = "md",
  debounce,
  autoFocus = false,
  className,
}: Props) {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = debounce ? internalValue : value;
  const hasValue = currentValue.trim().length > 0;

  /* Sync external value */
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  /* Debounce */
  useEffect(() => {
    if (!debounce) return;

    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounce);

    return () => clearTimeout(timer);
  }, [internalValue, debounce, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (debounce) {
      setInternalValue(newValue);
    } else {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInternalValue("");
      onChange("");
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInternalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4",
        "border border-gray-300 rounded-lg",
        "bg-white",
        "transition-colors duration-200",
        "focus-within:border-indigo-500",
        "focus-within:outline-none",
        "focus-within:ring-0",
        sizeMap[size],
        className,
      )}
    >
      <FiSearch size={18} className="text-gray-500 shrink-0" />

      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          "flex-1 bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400",
        )}
      />

      {hasValue && (
        <Button
          type="button"
          variant="text"
          color="secondary"
          iconOnly
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX size={16} />
        </Button>
      )}
    </div>
  );
}
