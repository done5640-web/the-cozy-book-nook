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
  subcategory?: string;
  description: string;
  rating: number;
  cover: string;
  featured: boolean;
  created_at: string;
  publisher?: string;
  pages?: number;
  year?: number;
}

function dbToBook(db: DbBook): Book {
  return {
    id: db.id,
    title: db.title,
    author: db.author,
    price: db.price,
    discount: db.discount ?? 0,
    genre: db.genre,
    subcategory: db.subcategory ?? undefined,
    description: db.description,
    rating: db.rating,
    cover: optimizeBookCover(db.cover),
    reviews: [],
    publisher: db.publisher ?? undefined,
    pages: db.pages ?? undefined,
    year: db.year ?? undefined,
  };
}

// ── PERFORMANCE OPTIMIZATION: localStorage cache ────────────────────────────
const BOOKS_CACHE_KEY = "books_cache_v1";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface BooksCache {
  books: Book[];
  featuredBooks: Book[];
  timestamp: number;
}

function getCachedBooks(): BooksCache | null {
  try {
    const raw = localStorage.getItem(BOOKS_CACHE_KEY);
    if (!raw) return null;
    const cache: BooksCache = JSON.parse(raw);
    const age = Date.now() - cache.timestamp;
    if (age > CACHE_DURATION) {
      localStorage.removeItem(BOOKS_CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

function setCachedBooks(books: Book[], featuredBooks: Book[]) {
  try {
    const cache: BooksCache = {
      books,
      featuredBooks,
      timestamp: Date.now(),
    };
    localStorage.setItem(BOOKS_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full or disabled
  }
}

export function useBooks() {
  // Start with cached data for instant display (stale-while-revalidate)
  const cachedData = getCachedBooks();
  const [books, setBooks] = useState<Book[]>(cachedData?.books || []);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>(cachedData?.featuredBooks || []);
  const [loading, setLoading] = useState(!cachedData);
  const [usingDb, setUsingDb] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Optimized query: explicit field selection (faster than SELECT *)
        const { data, error } = await supabase
          .from("books")
          .select("id, title, author, price, discount, genre, subcategory, description, rating, cover, featured, created_at, publisher, pages, year")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped = data.map(dbToBook);
          setBooks(mapped);
          const featured = data.filter((b: DbBook) => b.featured).map(dbToBook);
          const featuredList = featured.length > 0 ? featured : mapped.slice(0, 4);
          setFeaturedBooks(featuredList);
          setUsingDb(true);

          // Cache for next visit (instant load on return!)
          setCachedBooks(mapped, featuredList);
        }
      } catch {
        // Supabase not reachable - cached data already shown
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return { books, featuredBooks, loading, usingDb };
}
