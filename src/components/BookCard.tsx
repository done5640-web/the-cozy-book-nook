import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Book } from "@/data/books";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-card rounded-lg overflow-hidden border border-border group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-[border-color,box-shadow] duration-300"
    >
      <Link to={`/librat/${book.id}`}>
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
        <Link to={`/librat/${book.id}`}>
          <p className="text-xs text-primary font-medium mb-1">{book.genre}</p>
          <h3 className="font-serif font-semibold text-sm md:text-base mb-1 line-clamp-1 hover:text-primary transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{book.author}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm md:text-base text-foreground">{book.price} Lekë</span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(book);
            }}
            className="gap-0.5 md:gap-1 h-7 px-2 text-xs md:h-9 md:px-3 md:text-sm ml-1"
          >
            <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Shto
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
