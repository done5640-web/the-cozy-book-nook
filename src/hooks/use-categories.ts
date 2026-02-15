import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface DbCategory {
  id: string;
  name: string;
  created_at: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data) {
          setCategories(data.map((c: DbCategory) => c.name));
        }
      } catch {
        // Supabase not reachable
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
