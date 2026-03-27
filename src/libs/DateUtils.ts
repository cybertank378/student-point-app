//Files: src/libs/DateUtils.ts

// =====================================================
// DATE UTILS
// =====================================================

/**
 * Parse string/date menjadi Date object
 */
export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return date;
}

/**
 * Validasi apakah nilai merupakan tanggal valid
 */
export function isValidDate(input: unknown): boolean {
  const date = new Date(input as any);
  return !Number.isNaN(date.getTime());
}

/**
 * Ambil bagian tanggal ISO tanpa timezone shift
 */
function extractISODate(input: string | Date): {
  year: string;
  month: string;
  day: string;
} | null {
  let iso = "";

  if (typeof input === "string") {
    iso = input;
  } else {
    iso = input.toISOString();
  }

  const datePart = iso.split("T")[0];

  if (!datePart) return null;

  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return null;

  return { year, month, day };
}

/**
 * =====================================================
 * FORMAT DD-MM-YYYY
 * Example: 10-01-2026
 * =====================================================
 */
export function formatDate(input?: Date | string | null): string {
  if (!input) return "-";

  const parts = extractISODate(input);

  if (!parts) return "-";

  return `${parts.day}-${parts.month}-${parts.year}`;
}

/**
 * =====================================================
 * FORMAT DD/MM/YYYY
 * Example: 10/01/2026
 * =====================================================
 */
export function formatDateSlash(input?: Date | string | null): string {
  if (!input) return "-";

  const parts = extractISODate(input);

  if (!parts) return "-";

  return `${parts.day}/${parts.month}/${parts.year}`;
}

/**
 * =====================================================
 * FORMAT YYYY-MM-DD
 * Example: 2026-01-10
 * =====================================================
 */
export function formatDateISO(input?: Date | string | null): string {
  if (!input) return "-";

  const parts = extractISODate(input);

  if (!parts) return "-";

  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * =====================================================
 * FORMAT DATE FOR HTML INPUT
 * Example: 2026-01-10
 * =====================================================
 */
export function formatDateForInput(value: string | Date): string {
  const parts = extractISODate(value);

  if (!parts) return "";

  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * =====================================================
 * FORMAT LONG DATE INDONESIA
 * Example: 10 Januari 2026
 * =====================================================
 */
export function formatDateLongID(input?: Date | string | null): string {
  if (!input) return "-";

  const parts = extractISODate(input);

  if (!parts) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthIndex = Number(parts.month) - 1;

  return `${Number(parts.day)} ${months[monthIndex]} ${parts.year}`;
}

/**
 * =====================================================
 * FORMAT SHORT DATE INDONESIA
 * Example: 10 Jan
 * =====================================================
 */
export function formatDateShortID(input?: Date | string | null): string {
  if (!input) return "-";

  const parts = extractISODate(input);

  if (!parts) return "-";

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const monthIndex = Number(parts.month) - 1;

  return `${Number(parts.day)} ${months[monthIndex]}`;
}

/**
 * =====================================================
 * FORMAT DATE TIME INDONESIA
 * Example: 10 Januari 2026 21:19
 * =====================================================
 */
export function formatDateTimeID(input?: Date | string | null): string {
  if (!input) return "-";

  const date = new Date(input);

  if (Number.isNaN(date.getTime())) return "-";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

/**
 * =====================================================
 * FORMAT RELATIVE DATE
 * Example: 3 hari lalu
 * =====================================================
 */
export function formatRelativeDate(input?: Date | string | null): string {
  if (!input) return "-";

  const date = new Date(input);

  if (Number.isNaN(date.getTime())) return "-";

  const now = new Date();

  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;

  return "baru saja";
}


export function dateFormater(input: Date | string | null | undefined): string {
  if (!input) return "-";

  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) return "-";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
}
