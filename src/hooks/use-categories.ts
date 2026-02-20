import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface DbCategory {
  id: string;
  name: string;
  parent_id: string | null; // null = top-level category
  is_children?: boolean;    // special flag for children's theme
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  is_children: boolean;
  subcategories: Category[];
}

// ── LocalStorage cache keys ──────────────────────────────────────────────────
const LS_KEY = "cat_children_map";
const CATEGORIES_CACHE_KEY = "categories_cache_v1";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (categories change less often)

interface CategoriesCache {
  categories: string[];
  categoryObjects: Category[];
  timestamp: number;
}

/** Returns a map of { [categoryName]: is_children } from localStorage cache.
 *  This is available synchronously before Supabase responds. */
export function getCachedChildrenMap(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveChildrenMap(cats: Category[]) {
  try {
    const map: Record<string, boolean> = {};
    cats.forEach((c) => { map[c.name] = c.is_children; });
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

function getCachedCategories(): CategoriesCache | null {
  try {
    const raw = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (!raw) return null;
    const cache: CategoriesCache = JSON.parse(raw);
    const age = Date.now() - cache.timestamp;
    if (age > CACHE_DURATION) {
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

function setCachedCategories(categories: string[], categoryObjects: Category[]) {
  try {
    const cache: CategoriesCache = {
      categories,
      categoryObjects,
      timestamp: Date.now(),
    };
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full or disabled
  }
}

export function useCategories() {
  // Start with cached data for instant display
  const cachedData = getCachedCategories();
  const [categories, setCategories] = useState<string[]>(cachedData?.categories || []);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>(cachedData?.categoryObjects || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data) {
          const dbCats: DbCategory[] = data;

          // Build tree: top-level first
          const topLevel = dbCats.filter((c) => !c.parent_id);
          const built: Category[] = topLevel.map((cat) => ({
            id: cat.id,
            name: cat.name,
            parent_id: cat.parent_id,
            is_children: cat.is_children ?? false,
            subcategories: dbCats
              .filter((c) => c.parent_id === cat.id)
              .map((sub) => ({
                id: sub.id,
                name: sub.name,
                parent_id: sub.parent_id,
                is_children: sub.is_children ?? false,
                subcategories: [],
              })),
          }));

          const categoryNames = topLevel.map((c) => c.name);
          setCategoryObjects(built);
          setCategories(categoryNames);
          saveChildrenMap(built); // persist for theme detection
          setCachedCategories(categoryNames, built); // full cache
        }
      } catch {
        // Supabase not reachable - cached data already shown
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, categoryObjects, loading };
}
