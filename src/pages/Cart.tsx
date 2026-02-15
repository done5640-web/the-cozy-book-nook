import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl font-bold mb-8"
        >
          Shporta
        </motion.h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-xl font-semibold mb-2">Shporta juaj është bosh</h2>
            <p className="text-muted-foreground mb-6">Zbuloni librat tanë dhe shtoni diçka!</p>
            <Link to="/librat"><Button className="gap-2"><ArrowLeft className="h-4 w-4" /> Shfleto Librat</Button></Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.book.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-card p-4 rounded-lg border border-border"
                  >
                    <img
                      src={item.book.cover}
                      alt={item.book.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-sm line-clamp-1">{item.book.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.book.author}</p>
                      <p className="font-bold mt-2">{item.book.price} Lekë</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                          className="p-1 rounded-md bg-muted hover:bg-border transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                          className="p-1 rounded-md bg-muted hover:bg-border transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeFromCart(item.book.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-sm">{item.book.price * item.quantity} Lekë</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-lg border border-border h-fit sticky top-24"
            >
              <h2 className="font-serif text-xl font-bold mb-4">Përmbledhje</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nëntotali</span>
                  <span>{totalPrice} Lekë</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transporti</span>
                  <span className="text-accent">Falas</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Totali</span>
                  <span>{totalPrice} Lekë</span>
                </div>
              </div>
              <Button className="w-full mb-3">Vazhdo me Pagesën</Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>Pastro Shportën</Button>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
