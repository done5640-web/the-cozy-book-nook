import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Sparkles } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useCart } from "@/contexts/CartContext";
import { discountedPrice } from "@/data/books";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Same floating shapes as Books.tsx
function FloatingShape({ style, type }: { style: React.CSSProperties; type: number }) {
  const shapes = [
    <svg key="star" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>,
    <svg key="circle" viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8"/>
    </svg>,
    <svg key="diamond" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L22 12L12 22L2 12L12 2z"/>
    </svg>,
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

const FLOATER_DATA = Array.from({ length: 10 }, (_, i) => ({
  type: i % 4,
  style: {
    left: `${(i * 9.5) % 92}%`,
    top: `${6 + (i * 13) % 75}%`,
    width: `${14 + (i % 3) * 7}px`,
    height: `${14 + (i % 3) * 7}px`,
    color: ["#F9A8D4", "#C4B5FD", "#93C5FD", "#6EE7B7", "#FDE68A"][i % 5],
    opacity: 0.35,
  } as React.CSSProperties,
}));

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { books } = useBooks();
  const { categoryObjects } = useCategories();
  const book = books.find((b) => b.id === id);

  const isChildrenTheme = book
    ? (categoryObjects.find((c) => c.name === book.genre)?.is_children ?? false)
    : false;

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Libri nuk u gjet</h1>
          <Link to="/librat"><Button variant="outline">Kthehu te Librat</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedBooks = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-700 ${isChildrenTheme ? "bg-gradient-to-br from-[#FEF9EC] via-[#FDF0F8] to-[#EEF5FF]" : "bg-background"}`}>

      {/* Floating shapes for children mode */}
      <AnimatePresence>
        {isChildrenTheme && FLOATER_DATA.map((f, i) => (
          <FloatingShape key={i} type={f.type} style={f.style} />
        ))}
      </AnimatePresence>

      <Navbar />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link
          to="/librat"
          className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200 ${isChildrenTheme ? "text-purple-400 hover:text-purple-600" : "text-muted-foreground hover:text-primary"}`}
        >
          <ArrowLeft className="h-4 w-4" /> Kthehu te Librat
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex justify-center"
          >
            <img
              src={book.cover}
              alt={book.title}
              className={`max-h-[500px] object-cover ${isChildrenTheme ? "rounded-2xl shadow-2xl shadow-purple-200/60 border-2 border-purple-100" : "rounded-lg shadow-2xl"}`}
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Genre label */}
            {isChildrenTheme ? (
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-purple-400 text-sm font-semibold">{book.genre}</span>
              </div>
            ) : (
              <span className="text-primary text-sm font-medium">{book.genre}</span>
            )}

            <h1 className={`font-serif text-3xl md:text-4xl font-bold mt-2 mb-2 ${isChildrenTheme ? "text-slate-700" : ""}`}>
              {book.title}
            </h1>
            <p className={`mb-4 ${isChildrenTheme ? "text-purple-400" : "text-muted-foreground"}`}>
              nga {book.author}
            </p>

            <p className={`leading-relaxed mb-6 ${isChildrenTheme ? "text-slate-500" : "text-muted-foreground"}`}>
              {book.description}
            </p>

            {/* Extra book details */}
            {(book.publisher || book.pages || book.year) && (
              <div className={`flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm p-4 rounded-xl ${isChildrenTheme ? "bg-white/60 border border-purple-100" : "bg-muted/30 border border-border/40 rounded-xl"}`}>
                {book.publisher && (
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-wide font-medium ${isChildrenTheme ? "text-purple-300" : "text-muted-foreground"}`}>Shtëpia Botuese</span>
                    <span className={`font-medium ${isChildrenTheme ? "text-slate-600" : "text-foreground"}`}>{book.publisher}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-wide font-medium ${isChildrenTheme ? "text-purple-300" : "text-muted-foreground"}`}>Faqe</span>
                    <span className={`font-medium ${isChildrenTheme ? "text-slate-600" : "text-foreground"}`}>{book.pages}</span>
                  </div>
                )}
                {book.year && (
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-wide font-medium ${isChildrenTheme ? "text-purple-300" : "text-muted-foreground"}`}>Viti i Botimit</span>
                    <span className={`font-medium ${isChildrenTheme ? "text-slate-600" : "text-foreground"}`}>{book.year}</span>
                  </div>
                )}
              </div>
            )}

            {/* Price + Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex flex-col">
                {book.discount > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className={`font-serif text-3xl font-bold ${isChildrenTheme ? "text-purple-700" : "text-foreground"}`}>
                        {discountedPrice(book)} Lekë
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isChildrenTheme ? "bg-rose-400 text-white" : "bg-primary text-primary-foreground"}`}>
                        -{book.discount}%
                      </span>
                    </div>
                    <span className={`text-base line-through ${isChildrenTheme ? "text-purple-300" : "text-muted-foreground"}`}>
                      {book.price} Lekë
                    </span>
                  </>
                ) : (
                  <span className={`font-serif text-3xl font-bold ${isChildrenTheme ? "text-purple-700" : "text-foreground"}`}>
                    {book.price} Lekë
                  </span>
                )}
              </div>
              <Button
                size="lg"
                onClick={() => addToCart(book)}
                className={`gap-2 ${isChildrenTheme ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0" : ""}`}
              >
                <ShoppingCart className="h-4 w-4" /> Shto në Shportë
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Related books */}
        {relatedBooks.length > 0 && (
          <section className="mt-16">
            <h2 className={`font-serif text-2xl font-bold mb-6 ${isChildrenTheme ? "text-purple-600" : "text-gold"}`}>
              Libra të Ngjashëm
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} childrenTheme={isChildrenTheme} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
