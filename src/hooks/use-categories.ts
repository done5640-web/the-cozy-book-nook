import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { genres as fallbackGenres } from "@/data/books";

export interface DbCategory {
  id: string;
  name: string;
  created_at: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(fallbackGenres);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data && data.length > 0) {
          setCategories(data.map((c: DbCategory) => c.name));
        }
      } catch {
        // fallback to local genres
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
