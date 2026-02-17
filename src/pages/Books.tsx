import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X, Sparkles } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { useCategories, getCachedChildrenMap } from "@/hooks/use-categories";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BOOKS_PER_PAGE = 12;

// ── Elegant floating shapes for children's theme (SVG-based, no emoji) ────────
function FloatingShape({ style, type }: { style: React.CSSProperties; type: number }) {
  const shapes = [
    // Star
    <svg key="star" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>,
    // Circle
    <svg key="circle" viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8"/>
    </svg>,
    // Diamond
    <svg key="diamond" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L22 12L12 22L2 12L12 2z"/>
    </svg>,
    // Small star
    <svg key="smallstar" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 5l2.12 4.3 4.73.69-3.42 3.33.81 4.71L12 15.64l-4.24 2.23.81-4.71L5.15 9.99l4.73-.69L12 5z"/>
    </svg>,
  ];
  return (
    <motion.div
      className="pointer-events-none select-none fixed z-0"
      style={style}
      animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 4 + (type * 0.7), repeat: Infinity, ease: "easeInOut", delay: type * 0.4 }}
    >
      {shapes[type % shapes.length]}
    </motion.div>
  );
}

const FLOATER_DATA = Array.from({ length: 14 }, (_, i) => ({
  type: i % 4,
  style: {
    left: `${(i * 7.3) % 95}%`,
    top: `${8 + (i * 11) % 72}%`,
    width: `${16 + (i % 3) * 8}px`,
    height: `${16 + (i % 3) * 8}px`,
    color: ["#F9A8D4", "#C4B5FD", "#93C5FD", "#6EE7B7", "#FDE68A"][i % 5],
    opacity: 0.4,
  } as React.CSSProperties,
}));

// ── Magical cartoon iris-wipe transition ──────────────────────────────────────
// A smooth circular wipe expands from the center (like a classic cartoon scene change)
// then opens up to reveal the new theme, with playful floating stars bursting out.
function MagicTransition({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onDone}
    >
      {/* The iris: a circle that GROWS to fill the screen, then SHRINKS away */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: "radial-gradient(circle at center, #E8D5F5 0%, #FDF0F8 45%, #C4B5FD 100%)",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{
          width: ["0vmax", "300vmax", "300vmax", "0vmax"],
          height: ["0vmax", "300vmax", "300vmax", "0vmax"],
          opacity: [1, 1, 1, 0],
        }}
        transition={{
          duration: 1.15,
          times: [0, 0.38, 0.58, 1],
          ease: ["easeIn", "linear", "easeOut", "easeOut"],
        }}
      />

      {/* Sparkle stars that burst from center during the iris-open */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 2 * Math.PI;
        const dist = 120 + (i % 3) * 40;
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: 10 + (i % 3) * 4,
              height: 10 + (i % 3) * 4,
              background: ["#C4B5FD","#F9A8D4","#93C5FD","#FDE68A","#6EE7B7","#F9A8D4","#C4B5FD","#93C5FD"][i],
              borderRadius: i % 2 === 0 ? "50%" : "2px",
              transformOrigin: "center",
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 0.7,
              delay: 0.3 + i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}

      {/* A soft ring pulse expanding outward */}
      <motion.div
        className="absolute rounded-full border-4"
        style={{
          borderColor: "#C4B5FD",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ width: 0, height: 0, opacity: 0.8 }}
        animate={{ width: "200vmax", height: "200vmax", opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
      />
    </motion.div>
  );
}

// ── Animated rainbow border button for children category ─────────────────────
function KidsFilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className="relative text-sm font-medium px-3 py-1.5 rounded-md overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      style={{ padding: "1.5px" }} // gap for animated border
    >
      {/* Animated gradient border ring */}
      <motion.span
        className="absolute inset-0 rounded-md"
        style={{
          background: isActive
            ? "linear-gradient(135deg, #9333EA, #EC4899, #3B82F6, #9333EA)"
            : "linear-gradient(135deg, #C4B5FD, #F9A8D4, #93C5FD, #C4B5FD)",
          backgroundSize: "300% 300%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner fill */}
      <span
        className={`relative flex items-center gap-1 px-3 py-1 rounded-[5px] text-sm font-medium transition-colors ${
          isActive
            ? "bg-transparent text-white"
            : "bg-white/90 text-purple-800 hover:bg-white"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}

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
  const [showMagicTransition, setShowMagicTransition] = useState(false);

  // ── Sync state from URL on browser back/forward ────────────────────────────
  useEffect(() => {
    setSelectedGenre(searchParams.get("genre") || "Të gjitha");
    setSelectedSubcat(searchParams.get("subcat") || "");
    setSearchQuery(searchParams.get("q") || "");
    setPage(1);
  }, [searchParams]);

  // ── Detect children theme ──────────────────────────────────────────────────
  // Use cached map from localStorage so the correct theme is applied immediately
  // on render (before Supabase responds), eliminating the flash on reload.
  const cachedMap = getCachedChildrenMap();
  const activeCategory = categoryObjects.find((c) => c.name === selectedGenre);
  const isChildrenTheme = activeCategory
    ? activeCategory.is_children
    : (cachedMap[selectedGenre] ?? false);

  const prevIsChildrenRef = useRef(isChildrenTheme);

  // Trigger magic transition ONLY when the user actively switches INTO children theme
  // (not on initial page load, even if it starts in children theme)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevIsChildrenRef.current = isChildrenTheme;
      return;
    }
    if (isChildrenTheme && !prevIsChildrenRef.current) {
      setShowMagicTransition(true);
    }
    prevIsChildrenRef.current = isChildrenTheme;
  }, [isChildrenTheme]);

  // Sync body background so overscroll bounce matches the theme
  useEffect(() => {
    document.body.style.backgroundColor = isChildrenTheme ? "rgb(237 233 254)" : "";
    return () => { document.body.style.backgroundColor = ""; };
  }, [isChildrenTheme]);

  // Subcategories of selected genre
  const subcategories = activeCategory?.subcategories ?? [];

  // When genre changes, reset subcat
  useEffect(() => {
    setSelectedSubcat("");
  }, [selectedGenre]);

  const filteredBooks = useMemo(() => {
    let result = books;
    if (selectedGenre !== "Të gjitha") {
      result = result.filter((b) => b.genre === selectedGenre);
    }
    if (selectedSubcat) {
      result = result.filter((b) => b.subcategory === selectedSubcat);
    }
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
    if (genre === "Të gjitha") { p.delete("genre"); } else { p.set("genre", genre); }
    p.delete("subcat");
    setSearchParams(p);
  };

  const handleSubcat = (sub: string) => {
    setSelectedSubcat(sub);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (sub) { p.set("subcat", sub); } else { p.delete("subcat"); }
    setSearchParams(p);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
    const p = new URLSearchParams(searchParams);
    if (q.trim()) { p.set("q", q); } else { p.delete("q"); }
    setSearchParams(p);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 relative overflow-x-hidden ${isChildrenTheme ? "bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100" : "bg-background"}`}>

      {/* Magical transition overlay when entering children theme */}
      <AnimatePresence>
        {showMagicTransition && (
          <MagicTransition onDone={() => setShowMagicTransition(false)} />
        )}
      </AnimatePresence>

      {/* Elegant floating shapes for children theme */}
      <AnimatePresence>
        {isChildrenTheme && FLOATER_DATA.map((f, i) => (
          <FloatingShape key={i} type={f.type} style={f.style} />
        ))}
      </AnimatePresence>

      <Navbar />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden -mt-16 pt-28">
        {/* Background */}
        {!isChildrenTheme ? (
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
        ) : (
          /* Children hero — soft watercolour-style gradient, no photo */
          <div className="absolute inset-0 bg-gradient-to-b from-[#FADADD]/80 via-[#E8D5F5]/60 to-transparent" />
        )}

        <div className="container mx-auto px-4 text-center relative z-10">
          {isChildrenTheme ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="py-6"
            >
              {/* Decorative line above */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-5"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-300" />
                <Sparkles className="h-5 w-5 text-purple-800" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-300" />
              </motion.div>

              {/* Title — large, elegant, readable on light bg */}
              <h1 className="font-serif text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #9333EA 0%, #EC4899 50%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 8px rgba(147,51,234,0.15))",
                }}
              >
                {selectedGenre}
              </h1>

              <p className="text-base md:text-lg font-medium text-purple-800 tracking-wide">
                Zbuloni botën magjike të librave
              </p>

              {/* Decorative dots */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: i === 2 ? 10 : 6,
                      height: i === 2 ? 10 : 6,
                      background: ["#F9A8D4","#C4B5FD","#93C5FD","#6EE7B7","#FDE68A"][i],
                    }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
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
              className={`pl-10 pr-10 ${isChildrenTheme ? "border-purple-300 bg-purple-50 focus-visible:ring-purple-400 rounded-xl shadow-sm" : "bg-card"}`}
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
              const isActive = selectedGenre === genre;
              if (isKids) {
                return (
                  <KidsFilterButton
                    key={genre}
                    label={genre}
                    isActive={isActive}
                    onClick={() => handleGenre(genre)}
                  />
                );
              }
              return (
                <Button
                  key={genre}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenre(genre)}
                >
                  {genre}
                </Button>
              );
            })}
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className={`text-sm rounded-md px-3 py-2 ${
              isChildrenTheme
                ? "bg-purple-50 border border-purple-300 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                : "bg-card border border-border text-foreground"
            }`}
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
              className={`flex flex-wrap gap-2 mb-6 pl-2 border-l-2 ${isChildrenTheme ? "border-purple-400" : "border-primary/30"}`}
            >
              <button
                onClick={() => handleSubcat("")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedSubcat === ""
                    ? isChildrenTheme ? "bg-purple-800 text-white border-purple-600" : "bg-primary text-primary-foreground border-primary"
                    : isChildrenTheme ? "border-purple-400 text-purple-800 bg-purple-50 hover:bg-purple-200 hover:border-purple-600" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                Të gjitha
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcat(sub.name)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedSubcat === sub.name
                      ? isChildrenTheme ? "bg-purple-800 text-white border-purple-600" : "bg-primary text-primary-foreground border-primary"
                      : isChildrenTheme ? "border-purple-400 text-purple-800 bg-purple-50 hover:bg-purple-200 hover:border-purple-600" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
          <AnimatePresence mode="popLayout">
            {paginatedBooks.map((book, i) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{
                  duration: isChildrenTheme ? 0.45 : 0.3,
                  delay: isChildrenTheme ? i * 0.04 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={isChildrenTheme ? { y: -6, scale: 1.02 } : undefined}
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
            className="text-center py-16"
          >
            {isChildrenTheme ? (
              <div>
                <Sparkles className="h-12 w-12 text-purple-700 mx-auto mb-3" />
                <p className="text-purple-800 font-medium text-lg">Nuk u gjetën libra. Provoni sërish!</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nuk u gjetën libra për këtë kategori.</p>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Mbrapa
            </Button>
            <span className="text-sm text-muted-foreground">Faqja {page} nga {totalPages}</span>
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
