import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  // Hide on cart page, admin and login
  if (["/shporta", "/admin", "/login"].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <Link
        to="/shporta"
        className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform duration-200"
        aria-label="Shporta"
      >
        <ShoppingBag className="h-6 w-6" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
};

export default FloatingCart;
