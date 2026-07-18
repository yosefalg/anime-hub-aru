/**
 * AniVerse Web - Utility Functions
 * 
 * A comprehensive collection of helper functions used across the application.
 * Includes class merging, formatting, string manipulation, and time utilities.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar, enUS, ja, zhCN, ko, fr, de, es, it, pt, tr, ru } from "date-fns/locale";

// ==============================================================================
// 1. Tailwind Class Merger (The most used utility)
// ==============================================================================

/**
 * Merges Tailwind CSS classes intelligently.
 * Resolves conflicts between classes (e.g., `p-4` and `p-6` will result in `p-6`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==============================================================================
// 2. Date & Time Formatting
// ==============================================================================

const locales: Record<string, Locale> = {
  ar, enUS, ja, zhCN, ko, fr, de, es, it, pt, tr, ru,
};

/**
 * Formats a date string or Date object into a human-readable format.
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = "PPP",
  localeCode: string = "en"
): string {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  const locale = locales[localeCode] || enUS;
  return format(parsedDate, formatStr, { locale });
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "منذ يومين").
 */
export function formatRelativeTime(
  date: string | Date | null | undefined,
  localeCode: string = "en"
): string {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  const locale = locales[localeCode] || enUS;
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale });
}

// ==============================================================================
// 3. Video & Time Utilities
// ==============================================================================

/**
 * Converts seconds into a formatted time string (HH:MM:SS or MM:SS).
 * Example: 3665 -> "1:01:05", 65 -> "1:05"
 */
export function formatTime(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = secs.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}

/**
 * Calculates the percentage of progress.
 */
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  const progress = (current / total) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

// ==============================================================================
// 4. Number & Text Formatting
// ==============================================================================

/**
 * Formats large numbers into human-readable strings (e.g., 1500000 -> 1.5M).
 */
export function formatCompactNumber(number: number | null | undefined, locale: string = "en"): string {
  if (number === null || number === undefined) return "0";
  
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

/**
 * Formats file sizes into human-readable strings (e.g., 1048576 -> 1 MB).
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "0 B";
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Truncates text to a specified length and adds an ellipsis.
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// ==============================================================================
// 5. String & URL Utilities
// ==============================================================================

/**
 * Converts a string into a URL-friendly slug.
 * Example: "Demon Slayer: Kimetsu no Yaiba" -> "demon-slayer-kimetsu-no-yaiba"
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates an absolute URL based on the current environment.
 */
export function getAbsoluteUrl(path: string = ""): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

// ==============================================================================
// 6. Safe Parsing Utilities
// ==============================================================================

/**
 * Safely parses a JSON string. Returns null if parsing fails.
 */
export function safeJsonParse<T>(jsonString: string | null | undefined): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

/**
 * Checks if a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
