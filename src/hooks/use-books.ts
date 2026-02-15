import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { books as fallbackBooks, type Book } from "@/data/books";
import { optimizeBookCover } from "@/lib/utils";

interface DbBook {
  id: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  genre: string;
  description: string;
  rating: number;
  cover: string;
  featured: boolean;
  created_at: string;
}

function dbToBook(db: DbBook): Book {
  return {
    id: db.id,
    title: db.title,
    author: db.author,
    price: db.price,
    discount: db.discount ?? 0,
    genre: db.genre,
    description: db.description,
    rating: db.rating,
    cover: optimizeBookCover(db.cover),
    reviews: [],
  };
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDb, setUsingDb] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped = data.map(dbToBook);
          setBooks(mapped);
          const featured = data.filter((b: DbBook) => b.featured).map(dbToBook);
          setFeaturedBooks(featured.length > 0 ? featured : mapped.slice(0, 4));
          setUsingDb(true);
        }
      } catch {
        // Supabase not reachable
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return { books, featuredBooks, loading, usingDb };
}
