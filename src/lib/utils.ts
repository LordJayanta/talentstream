import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEmploymentType(value?: string | null) {
  if (!value) return "Full Time"
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export function timeAgo(dateInput: Date | string) {
  const date = new Date(dateInput)
  const diffInDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffInDays <= 0) return "today"
  if (diffInDays === 1) return "yesterday"
  return `${diffInDays} days ago`
}
