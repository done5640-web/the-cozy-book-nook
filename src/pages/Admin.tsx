import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Pencil, LogOut, Loader2, Save, X, Star, Eye, EyeOff, ImageIcon, Tag, Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DbBook {
  id: string;
  title: string;
  author: string;
  price: number;
  genre: string;
  description: string;
  rating: number;
  cover: string;
  featured: boolean;
  created_at: string;
}

interface DbCategory {
  id: string;
  name: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [tab, setTab] = useState<"books" | "categories">("books");

  // Books state
  const [books, setBooks] = useState<DbBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [editingBook, setEditingBook] = useState<Partial<DbBook> | null>(null);
  const [isNewBook, setIsNewBook] = useState(false);
  const [savingBook, setSavingBook] = useState(false);
  const [deletingBook, setDeletingBook] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [priceInput, setPriceInput] = useState("");

  // Categories state
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<DbCategory | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [deletingCat, setDeletingCat] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (data) setBooks(data);
    setLoadingBooks(false);
  };

  const fetchCategories = async () => {
    setLoadingCats(true);
    const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (data) setCategories(data);
    setLoadingCats(false);
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchCategories();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // ---- Book handlers ----
  const handleSaveBook = async () => {
    if (!editingBook?.title || !editingBook?.author || !editingBook?.cover) return;
    setSavingBook(true);
    if (isNewBook) {
      const { title, author, price, genre, description, cover, featured } = editingBook;
      await supabase.from("books").insert([{
        title, author, price: price || 0, genre: genre || (categories[0]?.name || ""),
        description: description || "", rating: 0, cover, featured: featured || false,
      }]);
    } else {
      const { id, created_at, ...updates } = editingBook as DbBook;
      await supabase.from("books").update(updates).eq("id", id);
    }
    await fetchBooks();
    setEditingBook(null);
    setIsNewBook(false);
    setSavingBook(false);
  };

  const handleDeleteBook = async (id: string) => {
    setDeletingBook(id);
    await supabase.from("books").delete().eq("id", id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setDeletingBook(null);
  };

  const toggleFeatured = async (book: DbBook) => {
    await supabase.from("books").update({ featured: !book.featured }).eq("id", book.id);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, featured: !b.featured } : b)));
  };

  // ---- Category handlers ----
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setSavingCat(true);
    await supabase.from("categories").insert([{ name: newCatName.trim() }]);
    setNewCatName("");
    await fetchCategories();
    setSavingCat(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCat || !editCatName.trim()) return;
    setSavingCat(true);
    await supabase.from("categories").update({ name: editCatName.trim() }).eq("id", editingCat.id);
    setEditingCat(null);
    setEditCatName("");
    await fetchCategories();
    setSavingCat(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingCat(id);
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeletingCat(null);
  };

  const compressImage = (file: File, maxWidth = 600, maxHeight = 900, quality = 0.75): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Compression failed")), "image/webp", quality);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error } = await supabase.storage.from("book-covers").upload(fileName, compressed, { contentType: "image/webp" });
      if (!error) {
        const { data: urlData } = supabase.storage.from("book-covers").getPublicUrl(fileName);
        setEditingBook((prev) => prev ? { ...prev, cover: urlData.publicUrl } : prev);
      }
    } catch {
      // fallback: upload original if compression fails
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from("book-covers").upload(fileName, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("book-covers").getPublicUrl(fileName);
        setEditingBook((prev) => prev ? { ...prev, cover: urlData.publicUrl } : prev);
      }
    }
    setUploadingImage(false);
  };

  const catNames = categories.map((c) => c.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img src="/logo-libraria.png" alt="Logo" className="h-8 w-auto" />
            </Link>
            <div>
              <h1 className="font-brand text-lg font-bold text-primary uppercase tracking-wider">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Dil
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex gap-1">
          <button
            onClick={() => setTab("books")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "books" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Librat
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "categories" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Kategoritë
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ======== BOOKS TAB ======== */}
        {tab === "books" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gold">Menaxho Librat</h2>
                <p className="text-sm text-muted-foreground">{books.length} libra gjithsej</p>
              </div>
              <Button onClick={() => { setEditingBook({ title: "", author: "", price: 0, genre: catNames[0] || "", description: "", cover: "", featured: false }); setPriceInput(""); setIsNewBook(true); }} className="gap-2">
                <Plus className="h-4 w-4" /> Shto Libër
              </Button>
            </div>

            {/* Book Edit Modal */}
            <AnimatePresence>
              {editingBook && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-10 px-4 overflow-y-auto"
                  onClick={(e) => { if (e.target === e.currentTarget) { setEditingBook(null); setIsNewBook(false); } }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mb-10"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl font-bold">{isNewBook ? "Shto Libër të Ri" : "Ndrysho Librin"}</h3>
                      <button onClick={() => { setEditingBook(null); setIsNewBook(false); }}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Titulli *</label>
                        <Input value={editingBook.title || ""} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} placeholder="Emri i librit" className="bg-background" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Autori *</label>
                        <Input value={editingBook.author || ""} onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} placeholder="Emri i autorit" className="bg-background" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Çmimi (Lekë)</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={priceInput}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            setPriceInput(raw);
                            setEditingBook({ ...editingBook, price: raw === "" ? 0 : parseInt(raw, 10) });
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Kategoria</label>
                        <select value={editingBook.genre || catNames[0] || ""} onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground">
                          {catNames.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Foto e Librit *</label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                            <Upload className="h-4 w-4" />
                            {uploadingImage ? "Duke ngarkuar..." : "Ngarko Foto"}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                          </label>
                          {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </div>
                        {editingBook.cover && (
                          <img src={editingBook.cover} alt="Preview" className="mt-2 h-32 object-cover rounded-lg border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Përshkrimi</label>
                        <Textarea value={editingBook.description || ""} onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })} rows={3} placeholder="Përshkrimi i librit..." className="bg-background" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="featured" checked={editingBook.featured || false} onChange={(e) => setEditingBook({ ...editingBook, featured: e.target.checked })} className="rounded border-border" />
                        <label htmlFor="featured" className="text-sm font-medium flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-primary" /> Shfaqe në Kreu (Featured)
                        </label>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleSaveBook} disabled={savingBook} className="flex-1 gap-2">
                          {savingBook ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {isNewBook ? "Shto" : "Ruaj"}
                        </Button>
                        <Button variant="outline" onClick={() => { setEditingBook(null); setIsNewBook(false); }}>Anulo</Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Book List */}
            {loadingBooks ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">Asnjë libër</h3>
                <p className="text-muted-foreground mb-6">Filloni duke shtuar librin e parë.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {books.map((book) => (
                  <motion.div key={book.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                    <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-serif font-semibold text-sm truncate">{book.title}</h3>
                        {book.featured && <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">Kreu</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-medium">{book.price} Lekë</span>
                        <span className="text-xs text-muted-foreground">{book.genre}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleFeatured(book)} className={`p-2 rounded-lg transition-colors ${book.featured ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground hover:bg-muted"}`} title={book.featured ? "Hiq nga Kreu" : "Shto në Kreu"}>
                        {book.featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => { setEditingBook({ ...book }); setPriceInput(String(book.price ?? "")); setIsNewBook(false); }} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Ndrysho"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteBook(book.id)} disabled={deletingBook === book.id} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" title="Fshi">
                        {deletingBook === book.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ======== CATEGORIES TAB ======== */}
        {tab === "categories" && (
          <>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-gold mb-1">Menaxho Kategoritë</h2>
              <p className="text-sm text-muted-foreground">{categories.length} kategori gjithsej</p>
            </div>

            {/* Add new category */}
            <div className="flex gap-3 mb-8">
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Emri i kategorisë së re..."
                className="bg-card max-w-sm"
                onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
              />
              <Button onClick={handleAddCategory} disabled={savingCat || !newCatName.trim()} className="gap-2 shrink-0">
                {savingCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Shto
              </Button>
            </div>

            {loadingCats ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">Asnjë kategori</h3>
                <p className="text-muted-foreground">Shtoni kategorinë e parë duke përdorur fushën sipër.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
                    {editingCat?.id === cat.id ? (
                      <>
                        <Input
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          className="bg-background flex-1"
                          onKeyDown={(e) => { if (e.key === "Enter") handleUpdateCategory(); }}
                          autoFocus
                        />
                        <Button size="sm" onClick={handleUpdateCategory} disabled={savingCat} className="gap-1">
                          {savingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          Ruaj
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingCat(null); setEditCatName(""); }}>Anulo</Button>
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 text-primary shrink-0" />
                        <span className="flex-1 text-sm font-medium">{cat.name}</span>
                        <span className="text-xs text-muted-foreground">{books.filter(b => b.genre === cat.name).length} libra</span>
                        <button onClick={() => { setEditingCat(cat); setEditCatName(cat.name); }} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteCategory(cat.id)} disabled={deletingCat === cat.id} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          {deletingCat === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
