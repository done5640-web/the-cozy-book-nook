import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { books } from "@/data/books";
import { useCart } from "@/contexts/CartContext";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const book = books.find((b) => b.id === id);

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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/librat" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kthehu te Librat
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center"
          >
            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              src={book.cover}
              alt={book.title}
              className="rounded-lg shadow-2xl max-h-[500px] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary text-sm font-medium">{book.genre}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-2">{book.title}</h1>
            <p className="text-muted-foreground mb-4">nga {book.author}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({book.rating})</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{book.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <span className="font-serif text-3xl font-bold text-foreground">{book.price} Lekë</span>
              <Button size="lg" onClick={() => addToCart(book)} className="gap-2">
                <ShoppingCart className="h-4 w-4" /> Shto në Shportë
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {book.reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Vlerësimet</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {book.reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-5 rounded-lg border border-border"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-primary text-primary" : "text-border"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-2">"{review.comment}"</p>
                  <p className="text-sm font-medium">{review.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {relatedBooks.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">Libra të Ngjashëm</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} />
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
