export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  discount: number; // percentage 0-100, e.g. 10 = 10% off
  genre: string;
  subcategory?: string; // optional subcategory name
  description: string;
  rating: number;
  reviews: { name: string; rating: number; comment: string }[];
  cover: string;
  publisher?: string;  // Shtëpia botuese
  pages?: number;      // Numri i faqeve
  year?: number;       // Viti i botimit
}

/** Returns the final price after discount */
export function discountedPrice(book: Book): number {
  if (!book.discount || book.discount <= 0) return book.price;
  return Math.round(book.price * (1 - book.discount / 100));
}

export const genres = ["Romancë", "Mister", "Fantazi", "Histori", "Zhvillim Personal"];

export const books: Book[] = [
  {
    id: "1",
    title: "Dashuria në Kohë Lufte",
    author: "Ismail Kadare",
    price: 1200,
    discount: 0,
    genre: "Romancë",
    description: "Një histori dashurie e thellë që zhvillohet gjatë viteve të luftës, ku dy shpirtra gjejnë njëri-tjetrin mes kaosit. Romani eksploron fuqinë e dashurisë për të mbijetuar edhe në kohërat më të errëta.",
    rating: 4.5,
    reviews: [
      { name: "Ana M.", rating: 5, comment: "Një kryevepër e vërtetë! Nuk munda ta lë poshtë." },
      { name: "Dritan K.", rating: 4, comment: "Shkrim i mrekullueshëm, plot emocione." },
    ],
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
  },
  {
    id: "2",
    title: "Misteri i Kalasë",
    author: "Fatos Kongoli",
    price: 950,
    discount: 0,
    genre: "Mister",
    description: "Një mister i errët që fshihet pas mureve të një kalaje antike. Kur një historian i ri zbulon një dorëshkrim të hershëm, ai hyn në një rrjet intrigash që kërcënon jetën e tij.",
    rating: 4.2,
    reviews: [
      { name: "Blerta S.", rating: 4, comment: "Suspensë e shkëlqyer nga fillimi deri në fund." },
      { name: "Genti P.", rating: 5, comment: "Plot kthesa të papritura!" },
    ],
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
  },
  {
    id: "3",
    title: "Bota e Fshehur",
    author: "Elvira Dones",
    price: 1100,
    discount: 0,
    genre: "Fantazi",
    description: "Një aventurë fantastike ku një vajzë e re zbulon një portal drejt një bote magjike. Aty ajo duhet të mësojë sekretet e magjisë për të shpëtuar të dy botët nga errësira.",
    rating: 4.7,
    reviews: [
      { name: "Klea R.", rating: 5, comment: "Magjike! Perfekte për të gjithë moshat." },
      { name: "Arben L.", rating: 4, comment: "Imaginatë e jashtëzakonshme." },
    ],
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop",
  },
  {
    id: "4",
    title: "Rrugëtimi i Skënderbeut",
    author: "Sabri Godo",
    price: 1350,
    discount: 0,
    genre: "Histori",
    description: "Një rrëfim epik i jetës së Gjergj Kastriotit Skënderbeut, heroit kombëtar shqiptar. Nga fëmijëria në oborrin osmane deri te betejat heroike për liri.",
    rating: 4.8,
    reviews: [
      { name: "Besnik H.", rating: 5, comment: "Një libër që çdo shqiptar duhet ta lexojë." },
      { name: "Mirela T.", rating: 5, comment: "Frymëzuese dhe e dokumentuar mirë." },
    ],
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=450&fit=crop",
  },
  {
    id: "5",
    title: "Mendja e Lirë",
    author: "Dritëro Agolli",
    price: 850,
    discount: 0,
    genre: "Zhvillim Personal",
    description: "Një udhëzues praktik për të çliruar mendjen nga kufizimet dhe për të arritur potencialin tuaj të plotë. Me teknika të provuara dhe histori frymëzuese.",
    rating: 4.3,
    reviews: [
      { name: "Fatjon D.", rating: 4, comment: "Më ndihmoi shumë në jetën time personale." },
      { name: "Lindita V.", rating: 5, comment: "Libër transformues!" },
    ],
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
  },
  {
    id: "6",
    title: "Netët e Tiranës",
    author: "Ben Blushi",
    price: 1050,
    discount: 0,
    genre: "Romancë",
    description: "Një romancë pasionante që zhvillohet në rrugët e Tiranës moderne. Dy persona me rrugëtime të ndryshme jetësore kryqëzohen në mënyrë të papritur.",
    rating: 4.1,
    reviews: [
      { name: "Suela M.", rating: 4, comment: "Romantike dhe realiste njëkohësisht." },
    ],
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
  },
  {
    id: "7",
    title: "Kodi i Humbur",
    author: "Gazmend Kapllani",
    price: 980,
    discount: 0,
    genre: "Mister",
    description: "Një thriller intelektual ku një kriptograf duhet të deshifrojë një kod antik për të parandaluar një katastrofë. Çdo faqe zbulon një enigmë të re.",
    rating: 4.4,
    reviews: [
      { name: "Erion B.", rating: 5, comment: "Nuk mund ta lija poshtë!" },
      { name: "Diana K.", rating: 4, comment: "Intrigante dhe e menduar mirë." },
    ],
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
  },
  {
    id: "8",
    title: "Fuqia e Zakoneve",
    author: "Ornela Vorpsi",
    price: 780,
    discount: 0,
    genre: "Zhvillim Personal",
    description: "Si të ndërtoni zakone të shëndetshme dhe si të eliminoni ato të dëmshme. Një qasje shkencore dhe praktike për ndryshimin personal.",
    rating: 4.6,
    reviews: [
      { name: "Alban G.", rating: 5, comment: "Ndryshoi mënyrën si mendoj për zakonet." },
      { name: "Teuta N.", rating: 4, comment: "Praktike dhe e zbatueshmе." },
    ],
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
  },
];

export const testimonials = [
  {
    name: "Elira Hoxha",
    text: "Stacioni i Librarisë është vendi im i preferuar për të gjetur libra të rrallë. Shërbimi është i shkëlqyer!",
    role: "Lexuese e apasionuar",
  },
  {
    name: "Artan Berisha",
    text: "Koleksioni i tyre është i mrekullueshëm. Gjithmonë gjej diçka të re dhe interesante.",
    role: "Profesor universiteti",
  },
  {
    name: "Manjola Dushi",
    text: "Atmosfera e ngrohtë dhe rekomandime personale. Ndihem si në shtëpi sa herë vizitoj.",
    role: "Shkrimtare",
  },
];
