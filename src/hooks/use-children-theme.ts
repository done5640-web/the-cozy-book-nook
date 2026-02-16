import { useSearchParams, useParams, useLocation } from "react-router-dom";
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
 * No Supabase call — safe to use in Navbar, Footer, etc.
 *
 * Works on:
 * - /librat?genre=X         → reads genre from URL search param
 * - /librat/:id             → reads genre from bookId→genre cache (written by BookCard)
 */
export function useIsChildrenTheme(): boolean {
  const [searchParams] = useSearchParams();
  const params = useParams<{ id?: string }>();
  const location = useLocation();
  const cachedMap = getCachedChildrenMap();

  // On /librat?genre=X
  const genre = searchParams.get("genre");
  if (genre) return cachedMap[genre] ?? false;

  // On /librat/:id (book details page)
  if (params.id && location.pathname.startsWith("/librat/")) {
    const bookGenre = getCachedBookGenre(params.id);
    if (bookGenre) return cachedMap[bookGenre] ?? false;
  }

  return false;
}
