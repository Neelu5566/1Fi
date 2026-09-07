import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware class merge, same helper the rest of the app uses. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
