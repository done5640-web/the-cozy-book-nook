import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.svg" alt="Logo" className="h-7 w-7" />
              <span className="font-serif text-lg font-bold text-primary">Stacioni i Librarisë</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Një vend ku librat gjejnë lexuesit e tyre. Ne besojmë se çdo libër ka fuqinë të ndryshojë jetë dhe të hapë horizonte të reja.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-gold">Lidhje të Shpejta</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Kreu</Link>
              <Link to="/rreth-nesh" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Rreth Nesh</Link>
              <Link to="/librat" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Librat</Link>
              <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Kontakt</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4 text-gold">Na Ndiqni</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Stacioni i Librarisë. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
