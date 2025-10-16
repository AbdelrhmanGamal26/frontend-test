import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMessageTime = (dateInput?: string | Date): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  // Same day → show HH:MM AM/PM
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    const timeString = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return timeString.toUpperCase(); // e.g. "3:45 PM"
  }

  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  // Otherwise → show "DD Mon YYYY" (e.g., "14 Oct 2025")
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", "Oct"
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function formatFullMessageDateTime(dateInput?: string | Date): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "Oct"
  const year = date.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}-${month}-${year} ${timeString.toUpperCase()}`;
}
