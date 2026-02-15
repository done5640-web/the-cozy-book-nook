import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BOOKS_PER_PAGE = 8;

const About = () => {
  const { books } = useBooks();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
  const paginatedBooks = books.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with background image */}
      <section className="relative py-28 overflow-hidden -mt-16 pt-36">
        <img
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1024&q=30"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-[#6B2D2D]/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Rreth Nesh</h1>
            <p className="text-white/80 text-lg">Libraria juaj online shqiptare</p>
          </motion.div>
        </div>
      </section>

      {/* Who we are - concise */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl font-bold mb-4 text-gold">Kush Jemi</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Stacioni i Librarisë është një librari online shqiptare. Ne sjellim librat më
              të mirë direkt tek dera juaj, kudo në Shqipëri.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Zgjedhim çdo libër me kujdes dhe e bëjmë porosinë sa më të thjeshtë
              përmes WhatsApp-it.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#6B2D2D] via-[#4A1E1E] to-[#2D0F0F] flex flex-col items-center justify-center p-8 border border-primary/20"
          >
            <img
              src="/logo-libraria.png"
              alt="Stacioni i Librarisë"
              className="h-24 w-auto mb-6 opacity-90"
            />
            <h3 className="font-brand text-xl sm:text-2xl font-bold text-primary tracking-wider uppercase text-center mb-2">
              Stacioni i Librarisë
            </h3>
            <p className="text-sm text-white/60 italic text-center">Uncover a world of imagination</p>
          </motion.div>
        </div>
      </section>

      {/* Our Collection - actual books from data */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl font-bold mb-10 text-center text-gold"
          >
            Nga Koleksioni Ynë
          </motion.h2>
          {books.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Asnjë libër ende.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedBooks.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                  >
                    <Link to={`/librat/${book.id}`} className="block group">
                      <div className="rounded-lg overflow-hidden aspect-[3/4] mb-2">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-serif text-sm font-semibold group-hover:text-primary transition-colors truncate">{book.title}</h3>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
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
            </>
          )}
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-lg overflow-hidden aspect-[4/3] md:order-1"
          >
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=40"
              alt="Lexim"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:order-2"
          >
            <h2 className="font-serif text-3xl font-bold mb-4 text-gold">Si Funksionon</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">1.</span>
                <span>Shfletoni katalogun tonë online</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">2.</span>
                <span>Shtoni librat në shportë</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">3.</span>
                <span>Porosisni përmes WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">4.</span>
                <span>Merrni librat në derë</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-gradient-to-br from-[#6B2D2D]/40 to-background border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Quote className="h-10 w-10 mx-auto mb-6 text-primary opacity-60" />
            <blockquote className="font-serif text-2xl md:text-3xl font-medium italic mb-4 leading-relaxed text-foreground">
              "Një dhomë pa libra është si një trup pa shpirt."
            </blockquote>
            <p className="text-muted-foreground">— Marcus Tullius Cicero</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
