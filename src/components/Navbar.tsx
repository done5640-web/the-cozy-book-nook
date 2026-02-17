import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useIsChildrenTheme } from "@/hooks/use-children-theme";
import { Button } from "@/components/ui/button";

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
  const { user, signOut } = useAuth();
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

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-700 ${
        isChildrenTheme
          ? "bg-white/95 border-purple-400/50"
          : "bg-background/95 border-border/50"
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img src="/logo-libraria.png" alt="Stacioni i Librarisë" fetchPriority="high" decoding="async" className="h-6 sm:h-7 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className={`font-brand text-[10px] sm:text-sm md:text-lg font-semibold tracking-wider uppercase leading-none translate-y-[1px] transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-800" : "text-primary"
            }`}>
              Stacioni i Librarisë
            </span>
          </a>

          {/* Desktop nav + cart + auth buttons */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`text-sm font-medium transition-colors duration-200 relative pb-1 ${
                  isChildrenTheme
                    ? location.pathname === link.to
                      ? "text-purple-800 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-100/400"
                      : "text-purple-800 hover:text-purple-800"
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
              <ShoppingCart className={`h-5 w-5 transition-colors duration-700 ${isChildrenTheme ? "text-purple-800" : "text-foreground"}`} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-colors duration-700 ${
                    isChildrenTheme ? "bg-purple-100/400 text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <span className={`text-xs truncate max-w-[120px] ${isChildrenTheme ? "text-purple-100/400" : "text-muted-foreground"}`}>
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Dil"
                  className={`p-2 rounded-full transition-colors duration-200 ${isChildrenTheme ? "hover:bg-purple-100 text-purple-100/400" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/hyr")}
                  className={`text-sm font-medium ${isChildrenTheme ? "text-purple-800 hover:bg-purple-100/40" : ""}`}
                >
                  Hyr
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/regjistrohu")}
                  className={`text-sm font-medium ${isChildrenTheme ? "bg-purple-100/400 hover:bg-purple-800 text-white" : ""}`}
                >
                  Regjistrohu
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/shporta"
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                isChildrenTheme ? "hover:bg-purple-100" : "hover:bg-muted"
              }`}
            >
              <ShoppingCart className={`h-5 w-5 transition-colors duration-700 ${isChildrenTheme ? "text-purple-800" : "text-foreground"}`} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold transition-colors duration-700 ${
                    isChildrenTheme ? "bg-purple-100/400 text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors duration-200 ${isChildrenTheme ? "hover:bg-purple-100 text-purple-800" : "hover:bg-muted"}`}
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
                isChildrenTheme ? "border-purple-400/50 bg-white/95" : "border-border/50"
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
                          ? "bg-purple-100/400 text-white"
                          : "text-purple-100/400 hover:bg-purple-100/40"
                        : location.pathname === link.to
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Mobile auth */}
                <div className={`border-t pt-3 mt-1 ${isChildrenTheme ? "border-purple-200/50" : "border-border/50"}`}>
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs ${isChildrenTheme ? "text-purple-100/400" : "text-muted-foreground"}`}>
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-left ${
                          isChildrenTheme ? "text-purple-100/400 hover:bg-purple-100/40" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                        Dil
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { setIsOpen(false); navigate("/hyr"); }}
                        className={`text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-left ${
                          isChildrenTheme ? "text-purple-100/400 hover:bg-purple-100/40" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Hyr
                      </button>
                      <button
                        onClick={() => { setIsOpen(false); navigate("/regjistrohu"); }}
                        className={`text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-left ${
                          isChildrenTheme ? "bg-purple-100/400 text-white" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        Regjistrohu
                      </button>
                    </div>
                  )}
                </div>
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
