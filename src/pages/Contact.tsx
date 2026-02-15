import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with background */}
      <section className="relative py-16 overflow-hidden -mt-16 pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1280&q=40')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-[#6B2D2D]/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Kontaktoni
          </motion.h1>
          <p className="text-white/70">Na shkruani dhe do ju përgjigjemi sa më shpejt</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="font-serif text-2xl font-bold mb-6 text-gold">Dërgoni një Mesazh</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Emri juaj" required className="bg-card border-border" />
              <Input type="email" placeholder="Email-i juaj" required className="bg-card border-border" />
              <Input placeholder="Subjekti" required className="bg-card border-border" />
              <Textarea placeholder="Mesazhi juaj..." rows={5} required className="bg-card border-border" />
              <Button type="submit" className="gap-2 w-full" disabled={sent}>
                {sent ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> U Dërgua!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Dërgo Mesazhin
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl font-bold mb-6 text-gold">Informacione</h2>
            <div className="flex gap-3 items-start">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Telefoni</p>
                <p className="text-sm text-muted-foreground">+355 69 364 2606</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-sm text-muted-foreground">info@stacioni-librarise.al</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Vendndodhja</p>
                <p className="text-sm text-muted-foreground">Online - Shqipëri</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
