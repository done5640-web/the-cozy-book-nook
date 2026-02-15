import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, BookOpen, Mail, Heart, Search, Sparkles, Landmark, Brain } from "lucide-react";
import { books, genres, testimonials } from "@/data/books";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LucideIcon } from "lucide-react";

const genreIcons: Record<string, LucideIcon> = {
  "Romancë": Heart,
  "Mister": Search,
  "Fantazi": Sparkles,
  "Histori": Landmark,
  "Zhvillim Personal": Brain,
};

const Index = () => {
  const featuredBooks = books.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Zbuloni botën e librave</span>
            </motion.div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Mirë se vini në{" "}
              <span className="text-primary">Stacionin e Dijes</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Zbuloni botëra magjike përmes faqeve të librave. Çdo libër është një udhëtim i ri drejt dijes dhe aventurës.
            </p>
            <Link to="/librat">
              <Button size="lg" className="gap-2 text-base px-8">
                Shfleto Librat <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold mb-3">Librat e Zgjedhur</h2>
          <p className="text-muted-foreground">Rekomandime të veçanta nga stafi ynë</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/librat">
            <Button variant="outline" className="gap-2">
              Shiko të gjitha <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-3">Kategoritë</h2>
            <p className="text-muted-foreground">Gjeni zhanrin tuaj të preferuar</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {genres.map((genre, i) => {
              const Icon = genreIcons[genre];
              return (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/librat?genre=${genre}`}
                    className="block p-6 bg-background rounded-lg border border-border text-center hover:border-primary hover:shadow-md transition-all group"
                  >
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-serif font-semibold text-sm group-hover:text-primary transition-colors">{genre}</h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl font-bold mb-3">Çfarë Thonë Lexuesit</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h2 className="font-serif text-2xl font-bold mb-3">Abonohu në Buletinin</h2>
            <p className="text-sm opacity-80 mb-6">Merrni njoftimet më të fundit për librat e rinj dhe ofertat speciale.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Email-i juaj..."
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="secondary" className="shrink-0">Abonohu</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
