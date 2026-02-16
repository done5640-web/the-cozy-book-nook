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

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

          setCategoryObjects(built);
          setCategories(topLevel.map((c) => c.name));
        }
      } catch {
        // Supabase not reachable
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, categoryObjects, loading };
}
