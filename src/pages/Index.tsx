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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const Index = () => {
  const featuredBooks = books.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-amber-900/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">Zbuloni botën e librave</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
            >
              Mirë se vini në{" "}
              <span className="text-primary">Stacionin e Dijes</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Zbuloni botëra magjike përmes faqeve të librave. Çdo libër është një udhëtim i ri drejt dijes dhe aventurës.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link to="/librat">
                <Button size="lg" className="gap-2 text-base px-10 py-6 text-lg font-semibold shadow-xl shadow-primary/25">
                  Shfleto Librat <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Books */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-gold">Librat e Zgjedhur</h2>
          <p className="text-muted-foreground">Rekomandime të veçanta nga stafi ynë</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/librat">
            <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
              Shiko të gjitha <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-gold">Kategoritë</h2>
            <p className="text-muted-foreground">Gjeni zhanrin tuaj të preferuar</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {genres.map((genre, i) => {
              const Icon = genreIcons[genre];
              return (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                >
                  <Link
                    to={`/librat?genre=${genre}`}
                    className="block p-6 bg-background rounded-lg border border-border text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                      <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-serif font-semibold text-sm group-hover:text-primary transition-colors duration-300">{genre}</h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-gold">Çfarë Thonë Lexuesit</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary/30 transition-colors duration-300"
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
      <section className="py-20 bg-gradient-to-br from-amber-900/40 to-background border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <Mail className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="font-serif text-2xl font-bold mb-3 text-gold">Abonohu në Buletinin</h2>
            <p className="text-sm text-muted-foreground mb-6">Merrni njoftimet më të fundit për librat e rinj dhe ofertat speciale.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Email-i juaj..."
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button className="shrink-0">Abonohu</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
