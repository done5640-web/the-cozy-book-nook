import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BOOKS_PER_PAGE = 12;

// ── Floating shapes for children's theme ──────────────────────────────────────
const SHAPES = ["⭐", "🌈", "🦄", "🐉", "🧸", "🎈", "🌟", "🦋", "🍭", "🎪", "🐬", "🌺"];

function ChildrenFloater({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <motion.span
      className="pointer-events-none select-none fixed text-2xl md:text-3xl z-0"
      style={style}
      animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    >
      {emoji}
    </motion.span>
  );
}

// Pre-computed positions so they're stable across re-renders
const floaterData = SHAPES.map((emoji, i) => ({
  emoji,
  style: {
    left: `${(i * 8.3) % 100}%`,
    top: `${10 + (i * 13) % 70}%`,
    opacity: 0.55,
  } as React.CSSProperties,
}));

// ── Rainbow gradient title for children mode ──────────────────────────────────
const RAINBOW_COLORS = ["#FF6B6B", "#FF9F43", "#FECA57", "#48DBB4", "#54A0FF", "#FF6B9D"];

const Books = () => {
  const { books } = useBooks();
  const { categories, categoryObjects } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "Të gjitha");
  const [selectedSubcat, setSelectedSubcat] = useState(searchParams.get("subcat") || "");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detect children theme
  const activeCategory = categoryObjects.find((c) => c.name === selectedGenre);
  const isChildrenTheme = activeCategory?.is_children ?? false;

  // Subcategories of selected genre
  const subcategories = activeCategory?.subcategories ?? [];

  // When genre changes, reset subcat
  useEffect(() => {
    setSelectedSubcat("");
  }, [selectedGenre]);

  const filteredBooks = useMemo(() => {
    let result = books;

    // Genre filter
    if (selectedGenre !== "Të gjitha") {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    // Subcategory filter
    if (selectedSubcat) {
      result = result.filter((b) => b.subcategory === selectedSubcat);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.publisher ?? "").toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          (b.subcategory ?? "").toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [books, selectedGenre, selectedSubcat, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  const handleGenre = (genre: string) => {
    setSelectedGenre(genre);
    setSelectedSubcat("");
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (genre === "Të gjitha") {
      p.delete("genre");
    } else {
      p.set("genre", genre);
    }
    p.delete("subcat");
    setSearchParams(p);
  };

  const handleSubcat = (sub: string) => {
    setSelectedSubcat(sub);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (sub) {
      p.set("subcat", sub);
    } else {
      p.delete("subcat");
    }
    setSearchParams(p);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (q.trim()) {
      p.set("q", q);
    } else {
      p.delete("q");
    }
    setSearchParams(p);
  };

  // ── Children theme styles ──────────────────────────────────────────────────
  const childrenBg = isChildrenTheme
    ? "bg-gradient-to-br from-[#FFF9C4] via-[#FFE0F0] to-[#E0F7FF]"
    : "bg-background";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${childrenBg} relative overflow-x-hidden`}>
      {/* Floating emoji decorations in children mode */}
      <AnimatePresence>
        {isChildrenTheme &&
          floaterData.map((f, i) => (
            <ChildrenFloater key={i} emoji={f.emoji} style={f.style} />
          ))}
      </AnimatePresence>

      <Navbar />

      {/* Hero */}
      <section className={`relative py-16 overflow-hidden -mt-16 pt-28 ${isChildrenTheme ? "" : ""}`}>
        {!isChildrenTheme && (
          <>
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1024&q=30"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
            <div className="absolute inset-0 bg-[#6B2D2D]/20" />
          </>
        )}

        {isChildrenTheme && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF176]/60 via-[#FFB3C6]/40 to-transparent" />
        )}

        <div className="container mx-auto px-4 text-center relative z-10">
          {isChildrenTheme ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                📚✨
              </motion.div>
              <h1
                className="font-serif text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
                style={{
                  background: `linear-gradient(90deg, ${RAINBOW_COLORS.join(", ")})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {selectedGenre}
              </h1>
              <motion.p
                className="text-lg font-semibold text-pink-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🌟 Libra magjikë për aventura të reja! 🌟
              </motion.p>
            </motion.div>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-4xl font-bold mb-4 text-white drop-shadow-lg"
              >
                {selectedGenre === "Të gjitha" ? "Librat Tanë" : selectedGenre}
              </motion.h1>
              <p className="text-white/70">Zbuloni koleksionin tonë të pasur</p>
            </>
          )}
        </div>
      </section>

      <section className="py-8 container mx-auto px-4 relative z-10">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Kërko sipas titullit, autorit, shtëpisë botuese..."
              className={`pl-10 pr-10 ${isChildrenTheme ? "border-pink-300 bg-white/80 focus:border-pink-400 focus:ring-pink-200 rounded-full shadow-md" : "bg-card"}`}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGenre === "Të gjitha" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenre("Të gjitha")}
            >
              Të gjitha
            </Button>
            {categories.map((genre) => {
              const catObj = categoryObjects.find((c) => c.name === genre);
              const isKids = catObj?.is_children ?? false;
              return (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenre(genre)}
                  className={isKids && selectedGenre !== genre ? "border-pink-300 text-pink-600 hover:bg-pink-50" : ""}
                >
                  {isKids && "🧒 "}{genre}
                </Button>
              );
            })}
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className={`text-sm border border-border rounded-md px-3 py-2 text-foreground ${isChildrenTheme ? "bg-white/80 border-pink-200" : "bg-card"}`}
          >
            <option value="default">Renditje</option>
            <option value="price-asc">Çmimi: Ulët → Lartë</option>
            <option value="price-desc">Çmimi: Lartë → Ulët</option>
          </select>
        </div>

        {/* Subcategory filters */}
        <AnimatePresence>
          {subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-6 pl-2 border-l-2 border-primary/30"
            >
              <button
                onClick={() => handleSubcat("")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedSubcat === "" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
              >
                Të gjitha
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcat(sub.name)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedSubcat === sub.name ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                >
                  {sub.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search result count */}
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredBooks.length === 0 ? "Nuk u gjetën libra" : `${filteredBooks.length} libra u gjetën për "${searchQuery}"`}
          </p>
        )}

        {/* Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${isChildrenTheme ? "relative z-10" : ""}`}>
          <AnimatePresence mode="popLayout">
            {paginatedBooks.map((book, i) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: isChildrenTheme ? 20 : 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: isChildrenTheme ? 0.5 : 0.3,
                  delay: isChildrenTheme ? i * 0.05 : 0,
                  ease: isChildrenTheme ? [0.175, 0.885, 0.32, 1.275] : "easeOut",
                }}
                whileHover={isChildrenTheme ? { scale: 1.04, rotate: [-1, 1][i % 2] } : undefined}
                className={isChildrenTheme ? "drop-shadow-md" : ""}
              >
                <BookCard book={book} childrenTheme={isChildrenTheme} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            {isChildrenTheme ? (
              <div>
                <div className="text-5xl mb-4">🔍📚</div>
                <p className="text-pink-500 font-semibold text-lg">Nuk u gjetën libra për këtë kategori. Provoni sërish!</p>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">Nuk u gjetën libra për këtë kategori.</p>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Mbrapa
            </Button>
            <span className="text-sm text-muted-foreground">
              Faqja {page} nga {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
              Para <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Books;
