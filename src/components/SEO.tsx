import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = "Stacioni i Librarisë - Libraria Online Shqiptare | Porosi Libra në Shqipëri",
  description = "Stacioni i Librarisë - libraria më e madhe online shqiptare. Porosi libra në të gjitha zhanret me dërgim në Shqipëri dhe mbarë botën. Zbuloni librat më të rinj dhe klasikët.",
  keywords = "stacioni librarise, stacioni i librarise, libraria online, libra shqip, porosi libra, libraria shqiptare, blerje libra online, libra ne shqiperi, librari online shqip, stacioni librari",
  image = "https://www.stacionilibrarise.al/preview-libraria.jpeg",
  url = "https://www.stacionilibrarise.al",
  type = "website",
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
