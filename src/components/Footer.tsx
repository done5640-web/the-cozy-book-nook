import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { useIsChildrenTheme } from "@/hooks/use-children-theme";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
  </svg>
);

const Footer = () => {
  const isChildrenTheme = useIsChildrenTheme();

  return (
    <footer className={`border-t mt-16 transition-colors duration-700 ${
      isChildrenTheme
        ? "bg-white/80 border-purple-200/60"
        : "bg-card border-border"
    }`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-libraria.png" alt="Logo" className="h-9 w-auto" />
              <span className={`font-brand text-lg font-semibold tracking-wider uppercase transition-colors duration-700 ${
                isChildrenTheme ? "text-purple-600" : "text-primary"
              }`}>
                Stacioni i Librarisë
              </span>
            </div>
            <p className={`text-sm max-w-md mb-2 transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-400" : "text-muted-foreground"
            }`}>
              Libraria juaj online shqiptare. Librat më të mirë, direkt tek dera juaj.
            </p>
            <p className={`text-xs italic opacity-70 transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-400" : "text-muted-foreground"
            }`}>
              'Uncover a world of imagination'
            </p>
          </div>

          <div>
            <h4 className={`font-serif font-semibold mb-4 transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-600" : "text-gold"
            }`}>
              Lidhje të Shpejta
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Kreu" },
                { to: "/rreth-nesh", label: "Rreth Nesh" },
                { to: "/librat", label: "Librat" },
                { to: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors duration-200 ${
                    isChildrenTheme
                      ? "text-purple-400 hover:text-purple-600"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-serif font-semibold mb-4 transition-colors duration-700 ${
              isChildrenTheme ? "text-purple-600" : "text-gold"
            }`}>
              Na Ndiqni
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "https://www.instagram.com/stacioni_librarise/", Icon: Instagram, label: "Instagram" },
                { href: "https://www.tiktok.com/@stacioni_librarise", Icon: TikTokIcon, label: "TikTok" },
                { href: "https://web.facebook.com/people/Stacioni-Librarise/61577328095437/", Icon: Facebook, label: "Facebook" },
                { href: "https://www.youtube.com/@stacionilibrarise", Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2.5 rounded-lg transition-colors duration-200 ${
                    isChildrenTheme
                      ? "bg-purple-50 text-purple-400 hover:bg-purple-500 hover:text-white"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t mt-8 pt-6 text-center transition-colors duration-700 ${
          isChildrenTheme ? "border-purple-200/60" : "border-border"
        }`}>
          <p className={`text-xs transition-colors duration-700 ${
            isChildrenTheme ? "text-purple-300" : "text-muted-foreground"
          }`}>
            &copy; 2026 Stacioni i Librarisë. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
