import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-libraria.png" alt="Logo" className="h-9 w-auto" />
              <span className="font-brand text-lg font-semibold text-primary tracking-wider uppercase">Stacioni i Librarisë</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-2">
              Libraria juaj online shqiptare. Librat më të mirë, direkt tek dera juaj.
            </p>
            <p className="text-muted-foreground text-xs italic opacity-70">
              'Uncover a world of imagination'
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
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/stacioni_librarise/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@stacioni_librarise"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href="https://web.facebook.com/people/Stacioni-Librarise/61577328095437/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@stacionilibrarise"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
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
