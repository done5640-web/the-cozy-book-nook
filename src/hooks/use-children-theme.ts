import { useSearchParams, useLocation } from "react-router-dom";
import { getCachedChildrenMap } from "@/hooks/use-categories";

const BOOK_GENRE_CACHE_KEY = "book_genre_cache";

function getCachedBookGenre(bookId: string): string | null {
  try {
    const raw = localStorage.getItem(BOOK_GENRE_CACHE_KEY);
    if (!raw) return null;
    const map: Record<string, string> = JSON.parse(raw);
    return map[bookId] ?? null;
  } catch { return null; }
}

/**
 * Lightweight hook: reads only from localStorage cache + URL params.
 * No Supabase call — safe to use in Navbar, Footer, FloatingCart, etc.
 *
 * Works on:
 * - /librat?genre=X         → reads genre from URL search param
 * - /librat/:id             → reads genre from bookId→genre cache (written by BookCard)
 */
export function useIsChildrenTheme(): boolean {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const cachedMap = getCachedChildrenMap();

  // On /librat?genre=X
  const genre = searchParams.get("genre");
  if (genre) return cachedMap[genre] ?? false;

  // On /librat/:id (book details page)
  // Extract id from pathname directly so this works even when rendered outside the route
  const match = location.pathname.match(/^\/librat\/(.+)$/);
  if (match) {
    const bookId = match[1];
    const bookGenre = getCachedBookGenre(bookId);
    if (bookGenre) return cachedMap[bookGenre] ?? false;
  }

  return false;
}
