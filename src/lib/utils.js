import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date"; // Handle empty or undefined values

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Check if date is valid

  return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short', // "Jan", "Feb", etc.
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Ensures AM/PM format
  }).format(date);
};
