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

      <section className="py-12 bg-paper">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl font-bold mb-4"
          >
            Kontaktoni
          </motion.h1>
          <p className="text-muted-foreground">Na shkruani dhe do ju përgjigjemi sa më shpejt</p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-serif text-2xl font-bold mb-6">Dërgoni një Mesazh</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Emri juaj" required />
              <Input type="email" placeholder="Email-i juaj" required />
              <Input placeholder="Subjekti" required />
              <Textarea placeholder="Mesazhi juaj..." rows={5} required />
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
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl font-bold mb-6">Informacione</h2>
            <div className="flex gap-3 items-start">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Adresa</p>
                <p className="text-sm text-muted-foreground">Rruga e Durrësit, Nr. 45, Tiranë, Shqipëri</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Telefoni</p>
                <p className="text-sm text-muted-foreground">+355 69 123 4567</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-sm text-muted-foreground">info@stacioni-librarise.al</p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center border border-border mt-6">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Harta - Tiranë, Shqipëri</p>
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
