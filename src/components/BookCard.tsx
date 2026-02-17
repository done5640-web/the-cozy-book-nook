import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { Book, discountedPrice } from "@/data/books";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { cacheBookGenre } from "@/pages/BookDetails";

interface BookCardProps {
  book: Book;
  childrenTheme?: boolean;
}

const BookCard = ({ book, childrenTheme = false }: BookCardProps) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (justAdded) return;
    addToCart(book);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  // Cache bookId→genre before navigating so BookDetails gets theme instantly
  const handleLinkClick = () => cacheBookGenre(book.id, book.genre);

  if (childrenTheme) {
    return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-purple-50 rounded-2xl overflow-hidden border border-purple-200 group hover:border-purple-500 hover:shadow-xl hover:shadow-purple-300/40 transition-all duration-300"
      >
        <Link to={`/librat/${book.id}`} onClick={handleLinkClick}>
          <div className="aspect-[2/3] overflow-hidden relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
        <div className="p-2.5 md:p-4">
          <Link to={`/librat/${book.id}`} onClick={handleLinkClick}>
            <p className="text-xs text-purple-800 font-semibold mb-1">{book.genre}</p>
            <h3 className="font-serif font-bold text-sm md:text-base mb-1 line-clamp-1 text-slate-700 group-hover:text-purple-800 transition-colors duration-200">
              {book.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mb-2">{book.author}</p>
          </Link>
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex flex-col justify-end min-w-0 shrink">
              {book.discount > 0 ? (
                <>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-sm md:text-base text-purple-700 leading-tight">{discountedPrice(book)} Lekë</span>
                    <span className="bg-rose-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight shrink-0">-{book.discount}%</span>
                  </div>
                  <span className="text-xs text-slate-300 line-through leading-tight">{book.price} Lekë</span>
                </>
              ) : (
                <span className="font-bold text-sm md:text-base text-purple-700 truncate">{book.price} Lekë</span>
              )}
            </div>
            <motion.div whileTap={{ scale: 0.88 }} className="shrink-0">
              <Button
                size="sm"
                onClick={handleAdd}
                className={`gap-0.5 md:gap-1 h-7 px-2 text-xs md:h-9 md:px-3 md:text-sm transition-all duration-300 ${
                  justAdded
                    ? "bg-green-500 hover:bg-green-500 border-green-500"
                    : "bg-gradient-to-r from-violet-600 to-purple-700 border-0 hover:from-violet-700 hover:to-purple-800"
                } text-white`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {justAdded ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-0.5">
                      <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    </motion.span>
                  ) : (
                    <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-0.5 md:gap-1">
                      <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Shto
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-card rounded-lg overflow-hidden border border-border group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-[border-color,box-shadow] duration-300"
    >
      <Link to={`/librat/${book.id}`} onClick={handleLinkClick}>
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-2.5 md:p-4">
        <Link to={`/librat/${book.id}`} onClick={handleLinkClick}>
          <p className="text-xs text-primary font-medium mb-1">{book.genre}</p>
          <h3 className="font-serif font-semibold text-sm md:text-base mb-1 line-clamp-1 hover:text-primary transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{book.author}</p>
        </Link>
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="flex flex-col justify-end min-w-0 shrink">
            {book.discount > 0 ? (
              <>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold text-sm md:text-base text-foreground leading-tight">{discountedPrice(book)} Lekë</span>
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight shrink-0">-{book.discount}%</span>
                </div>
                <span className="text-xs text-muted-foreground line-through leading-tight">{book.price} Lekë</span>
              </>
            ) : (
              <span className="font-bold text-sm md:text-base text-foreground truncate">{book.price} Lekë</span>
            )}
          </div>
          <motion.div whileTap={{ scale: 0.88 }} className="shrink-0">
            <Button
              size="sm"
              onClick={handleAdd}
              className={`gap-0.5 md:gap-1 h-7 px-2 text-xs md:h-9 md:px-3 md:text-sm transition-all duration-300 ${
                justAdded ? "bg-green-600 hover:bg-green-600 border-green-600" : ""
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-0.5">
                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-0.5 md:gap-1">
                    <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    Shto
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
