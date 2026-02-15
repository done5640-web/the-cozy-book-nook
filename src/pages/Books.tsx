import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { books, genres } from "@/data/books";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "Të gjitha");
  const [sortBy, setSortBy] = useState("default");

  const filteredBooks = useMemo(() => {
    let result = selectedGenre === "Të gjitha" ? books : books.filter((b) => b.genre === selectedGenre);
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedGenre, sortBy]);

  const handleGenre = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "Të gjitha") {
      searchParams.delete("genre");
    } else {
      searchParams.set("genre", genre);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl font-bold mb-4 text-gold"
          >
            Librat Tanë
          </motion.h1>
          <p className="text-muted-foreground">Zbuloni koleksionin tonë të pasur</p>
        </div>
      </section>

      <section className="py-8 container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedGenre === "Të gjitha" ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenre("Të gjitha")}
            >
              Të gjitha
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-card border border-border rounded-md px-3 py-2 text-foreground"
          >
            <option value="default">Renditje</option>
            <option value="price-asc">Çmimi: Ulët &rarr; Lartë</option>
            <option value="price-desc">Çmimi: Lartë &rarr; Ulët</option>
            <option value="rating">Vlerësimi</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBooks.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Nuk u gjetën libra për këtë kategori.</p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Books;
