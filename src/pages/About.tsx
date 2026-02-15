import { motion } from "framer-motion";
import { Heart, Eye, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const timelineEvents = [
  { year: "2015", title: "Fillimi i Ëndrrës", description: "Ideja për Stacionin e Librarisë lindi nga dashuria për librat shqiptarë." },
  { year: "2017", title: "Dyqani i Parë", description: "Hapëm dyqanin tonë të parë fizik në qendër të Tiranës." },
  { year: "2020", title: "Dixhitalizimi", description: "Kaluam në platformën online për të arritur lexues në të gjithë Shqipërinë." },
  { year: "2023", title: "Komuniteti", description: "Krijuam një komunitet me mbi 10,000 lexues aktivë." },
  { year: "2026", title: "Sot", description: "Vazhdojmë misionin tonë për të sjellë librat më të mirë tek ju." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-gold">Rreth Nesh</h1>
            <p className="text-muted-foreground text-lg">
              Një histori dashurie me librat dhe lexuesit e tyre
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl font-bold mb-6 text-center text-gold">Historia Jonë</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Stacioni i Librarisë lindi nga një ëndërr e thjeshtë — të krijojmë një vend ku çdo lexues
            mund të gjejë librin e tij të ardhshëm të preferuar. Ne besojmë se librat janë ura që lidhin
            mendjet, zemrat dhe kulturat.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Çdo libër në koleksionin tonë është zgjedhur me kujdes, duke menduar për lexuesin që do ta
            hapë për herë të parë. Ne nuk shesim thjesht libra — ne ndajmë histori, dije dhe emocione.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center text-gold">Rrugëtimi Ynë</h2>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
            {timelineEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className={`relative pl-12 md:pl-0 mb-10 ${
                  i % 2 === 0 ? "md:pr-[55%]" : "md:pl-[55%]"
                }`}
              >
                <div className="absolute left-2 md:left-1/2 top-1 w-5 h-5 rounded-full bg-primary border-4 border-background md:-translate-x-1/2" />
                <div className="bg-background p-5 rounded-lg border border-border hover:border-primary/30 transition-colors duration-300">
                  <span className="text-primary font-bold text-sm">{event.year}</span>
                  <h3 className="font-serif font-semibold mt-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card p-8 rounded-lg border border-border text-center hover:border-primary/30 transition-colors duration-300"
          >
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-3 text-gold">Misioni Ynë</h3>
            <p className="text-sm text-muted-foreground">
              Të sjellim librat më të mirë sa më afër lexuesve shqiptarë, duke krijuar
              një eksperiencë blerjeje të ngrohtë dhe personale.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card p-8 rounded-lg border border-border text-center hover:border-primary/30 transition-colors duration-300"
          >
            <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-3 text-gold">Vizioni Ynë</h3>
            <p className="text-sm text-muted-foreground">
              Një Shqipëri ku çdo njeri ka akses te librat cilësorë dhe ku leximi
              është pjesë e pandashme e jetës së përditshme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-gradient-to-br from-amber-900/40 to-background border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Quote className="h-10 w-10 mx-auto mb-6 text-primary opacity-60" />
            <blockquote className="font-serif text-2xl md:text-3xl font-medium italic mb-4 leading-relaxed text-foreground">
              "Një dhomë pa libra është si një trup pa shpirt."
            </blockquote>
            <p className="text-muted-foreground">— Marcus Tullius Cicero</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
