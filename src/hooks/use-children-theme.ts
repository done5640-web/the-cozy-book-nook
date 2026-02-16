import { useSearchParams } from "react-router-dom";
import { getCachedChildrenMap } from "@/hooks/use-categories";

/**
 * Lightweight hook: reads only from localStorage cache + URL params.
 * No Supabase call — safe to use in Navbar, Footer, etc.
 * The cache is always up-to-date because useCategories() writes it after every fetch.
 */
export function useIsChildrenTheme(): boolean {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre") || "";
  if (!genre) return false;
  const cached = getCachedChildrenMap();
  return cached[genre] ?? false;
}
