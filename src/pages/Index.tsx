import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const Index = () => {
  const { books, featuredBooks } = useBooks();
  const { categoryObjects } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      <SEO />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center -mt-16 pt-16">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1024&q=30"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-[#6B2D2D]/40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">Zbuloni botën e librave</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-brand text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg uppercase tracking-wide"
            >
              Stacioni i{" "}
              <span className="text-primary">Librarisë</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-base md:text-lg text-white/80 mb-2 max-w-xl mx-auto leading-relaxed italic"
            >
              'Uncover a world of imagination'
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-sm md:text-base text-white/60 mb-8 max-w-lg mx-auto leading-relaxed"
            >
              Porosi në të gjithë botën — librat tuaj të preferuar, kudo që jeni.
            </motion.p>
            <motion.div variants={fadeUp} custom={4}>
              <Link to="/librat">
                <Button size="lg" className="gap-2 text-base px-8 py-5 font-semibold shadow-xl shadow-primary/25">
                  Shfleto Librat <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
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
          {featuredBooks.slice(0, 4).map((book, i) => (
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

      {/* Categories - Clean Design, No Icons */}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryObjects.map((cat, i) => {
              const genreBookCount = books.filter(b => b.genre === cat.name).length;
              const isKids = cat.is_children;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full"
                >
                  <Link
                    to={`/librat?genre=${cat.name}`}
                    className={`group flex flex-col justify-between h-full rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 ${
                      isKids
                        ? "bg-gradient-to-br from-purple-100/40 to-violet-50 border border-purple-200 hover:border-purple-600 hover:shadow-xl hover:shadow-purple-100/50"
                        : "bg-gradient-to-br from-background to-muted border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                    }`}
                  >
                    <div>
                      <h3 className={`font-serif font-bold text-lg mb-2 transition-colors duration-300 ${isKids ? "text-purple-800 group-hover:text-purple-800" : "group-hover:text-primary"}`}>
                        {cat.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted-foreground font-medium">{genreBookCount} libra</span>
                      <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-all duration-300 ${isKids ? "text-purple-700 group-hover:text-purple-900" : "text-primary/40 group-hover:text-primary"}`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
