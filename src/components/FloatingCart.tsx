import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useIsChildrenTheme } from "@/hooks/use-children-theme";

const FloatingCart = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const isChildrenTheme = useIsChildrenTheme();

  // Hide on cart page, admin and login
  if (["/shporta", "/admin", "/login"].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <Link
        to="/shporta"
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-700 hover:scale-105 active:scale-95 ${
          isChildrenTheme
            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-purple-300/50"
            : "bg-primary text-primary-foreground shadow-primary/30"
        }`}
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
              className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-colors duration-700 ${
                isChildrenTheme
                  ? "bg-rose-400 text-white"
                  : "bg-foreground text-background"
              }`}
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
