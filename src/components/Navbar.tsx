import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useIsChildrenTheme } from "@/hooks/use-children-theme";

const navLinks = [
  { to: "/", label: "Kreu" },
  { to: "/rreth-nesh", label: "Rreth Nesh" },
  { to: "/librat", label: "Librat" },
  { to: "/kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const isChildrenTheme = useIsChildrenTheme();

  const handleNavClick = (to: string) => {
    setIsOpen(false);
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(to);
      window.scrollTo({ top: 0 });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-700 ${
        isChildrenTheme
          ? "bg-white/90 border-purple-200/60"
          : "bg-background/95 border-border/50"
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img src="/logo-libraria.png" alt="Stacioni i Librarisë" className="h-6 sm:h-7 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className={`font-brand text-[10px] sm:text-sm md:text-lg font-semibold tracking-wider uppercase leading-none translate-y-[1px] transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-600" : "text-primary"
            }`}>
              Stacioni i Librarisë
            </span>
          </a>

          {/* Desktop nav + cart grouped together */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`text-sm font-medium transition-colors duration-200 relative pb-1 ${
                  isChildrenTheme
                    ? location.pathname === link.to
                      ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500"
                      : "text-purple-400 hover:text-purple-600"
                    : location.pathname === link.to
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/shporta"
              className={`relative p-2 rounded-full transition-colors duration-200 ml-2 ${
                isChildrenTheme ? "hover:bg-purple-100" : "hover:bg-muted"
              }`}
            >
              <ShoppingCart className={`h-5 w-5 transition-colors duration-700 ${isChildrenTheme ? "text-purple-600" : "text-foreground"}`} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-colors duration-700 ${
                    isChildrenTheme ? "bg-purple-500 text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/shporta"
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                isChildrenTheme ? "hover:bg-purple-100" : "hover:bg-muted"
              }`}
            >
              <ShoppingCart className={`h-5 w-5 transition-colors duration-700 ${isChildrenTheme ? "text-purple-600" : "text-foreground"}`} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-colors duration-700 ${
                    isChildrenTheme ? "bg-purple-500 text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors duration-200 ${isChildrenTheme ? "hover:bg-purple-100 text-purple-600" : "hover:bg-muted"}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`md:hidden overflow-hidden border-t transition-colors duration-700 ${
                isChildrenTheme ? "border-purple-200/60 bg-white/95" : "border-border/50"
              }`}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className={`text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-left ${
                      isChildrenTheme
                        ? location.pathname === link.to
                          ? "bg-purple-500 text-white"
                          : "text-purple-500 hover:bg-purple-50"
                        : location.pathname === link.to
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" />
    </>
  );
};

export default Navbar;
