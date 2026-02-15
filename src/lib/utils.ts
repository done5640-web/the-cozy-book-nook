import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the cover URL as-is.
 * Compression happens at upload time (client-side WebP conversion in Admin).
 * The Supabase Image Transform API (/render/image/) requires a Pro plan
 * so we intentionally skip URL rewriting on the free tier.
 */
export function optimizeBookCover(url: string): string {
  return url ?? "";
}
