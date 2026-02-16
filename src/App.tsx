import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import FloatingCart from "@/components/FloatingCart";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import About from "./pages/About";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Renders Navbar for all routes except admin and login
const AppNavbar = () => {
  const { pathname } = useLocation();
  if (pathname === "/admin" || pathname === "/login") return null;
  return <Navbar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppNavbar />
            <FloatingCart />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rreth-nesh" element={<About />} />
              <Route path="/librat" element={<Books />} />
              <Route path="/librat/:id" element={<BookDetails />} />
              <Route path="/shporta" element={<Cart />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
