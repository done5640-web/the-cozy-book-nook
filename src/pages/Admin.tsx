import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Pencil, LogOut, Loader2, Save, X, Star, Eye, EyeOff, ImageIcon, Tag, Upload, Users, ShoppingBag, TrendingUp, Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DbOrder {
  id: string;
  user_id: string;
  user_email: string;
  items: { book_id: string; title: string; quantity: number; price: number }[];
  total: number;
  created_at: string;
}

interface DbBook {
  id: string;
  title: string;
  author: string;
  price: number;
  discount: number;
  genre: string;
  subcategory?: string;
  description: string;
  rating: number;
  cover: string;
  featured: boolean;
  created_at: string;
  publisher?: string;
  pages?: number;
  year?: number;
}

interface DbCategory {
  id: string;
  name: string;
  parent_id: string | null;
  is_children: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [tab, setTab] = useState<"books" | "categories" | "users">("books");

  // Orders / users state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [profiles, setProfiles] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const [{ data: orderData }, { data: profileData }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    if (orderData) setOrders(orderData as DbOrder[]);
    if (profileData) setProfiles(profileData);
    setLoadingOrders(false);
  };

  // Books state
  const [books, setBooks] = useState<DbBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [editingBook, setEditingBook] = useState<Partial<DbBook> | null>(null);
  const [isNewBook, setIsNewBook] = useState(false);
  const [savingBook, setSavingBook] = useState(false);
  const [deletingBook, setDeletingBook] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");

  // Publisher/pages/year string inputs
  const [pagesInput, setPagesInput] = useState("");
  const [yearInput, setYearInput] = useState("");

  // Categories state
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<string>("");
  const [newCatIsChildren, setNewCatIsChildren] = useState(false);
  const [editingCat, setEditingCat] = useState<DbCategory | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatIsChildren, setEditCatIsChildren] = useState(false);
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
      fetchOrders();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/hyr" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  // ---- Book handlers ----
  const handleSaveBook = async () => {
    if (!editingBook?.title || !editingBook?.author || !editingBook?.cover) return;
    setSavingBook(true);
    if (isNewBook) {
      const { title, author, price, discount, genre, subcategory, description, cover, featured, publisher, pages, year } = editingBook;
      await supabase.from("books").insert([{
        title, author, price: price || 0, discount: discount || 0,
        genre: genre || (categories[0]?.name || ""),
        subcategory: subcategory || null,
        description: description || "", rating: 0, cover, featured: featured || false,
        publisher: publisher || null,
        pages: pages || null,
        year: year || null,
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
    await supabase.from("categories").insert([{
      name: newCatName.trim(),
      parent_id: newCatParentId || null,
      is_children: newCatIsChildren,
    }]);
    setNewCatName("");
    setNewCatParentId("");
    setNewCatIsChildren(false);
    await fetchCategories();
    setSavingCat(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCat || !editCatName.trim()) return;
    setSavingCat(true);
    const newName = editCatName.trim();
    const oldName = editingCat.name;
    // Update category name
    await supabase.from("categories").update({ name: newName, is_children: editCatIsChildren }).eq("id", editingCat.id);
    // If name changed, cascade update books.genre and books.subcategory
    if (newName !== oldName) {
      // If this is a top-level category, update books.genre
      if (!editingCat.parent_id) {
        await supabase.from("books").update({ genre: newName }).eq("genre", oldName);
      } else {
        // If subcategory, update books.subcategory
        await supabase.from("books").update({ subcategory: newName }).eq("subcategory", oldName);
      }
    }
    setEditingCat(null);
    setEditCatName("");
    setEditCatIsChildren(false);
    await fetchCategories();
    await fetchBooks();
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

  // Top-level categories only (no parent) for genre selector
  const topLevelCats = categories.filter((c) => !c.parent_id);
  const catNames = topLevelCats.map((c) => c.name);

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
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Përdoruesit
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
              <Button onClick={() => { setEditingBook({ title: "", author: "", price: 0, discount: 0, genre: catNames[0] || "", subcategory: "", description: "", cover: "", featured: false, publisher: "", pages: undefined, year: undefined }); setPriceInput(""); setDiscountInput(""); setPagesInput(""); setYearInput(""); setIsNewBook(true); }} className="gap-2">
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
                        <label className="text-sm font-medium mb-1 block">Zbritja (%)</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={discountInput}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            const clamped = Math.min(100, parseInt(raw, 10) || 0);
                            setDiscountInput(raw === "" ? "" : String(clamped));
                            setEditingBook({ ...editingBook, discount: clamped });
                          }}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {(editingBook.discount ?? 0) > 0 && (editingBook.price ?? 0) > 0 && (
                          <p className="text-xs text-primary mt-1">
                            Çmimi me zbritje: <span className="font-bold">{Math.round((editingBook.price ?? 0) * (1 - (editingBook.discount ?? 0) / 100))} Lekë</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Kategoria</label>
                        <select value={editingBook.genre || catNames[0] || ""} onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value, subcategory: "" })} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground">
                          {catNames.map((g) => (<option key={g} value={g}>{g}</option>))}
                        </select>
                      </div>
                      {/* Subcategory — show if selected category has subcats */}
                      {(() => {
                        const parentCat = topLevelCats.find((c) => c.name === editingBook.genre);
                        const subs = parentCat ? categories.filter((c) => c.parent_id === parentCat.id) : [];
                        if (subs.length === 0) return null;
                        return (
                          <div>
                            <label className="text-sm font-medium mb-1 block">Nënkategoria</label>
                            <select value={editingBook.subcategory || ""} onChange={(e) => setEditingBook({ ...editingBook, subcategory: e.target.value })} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground">
                              <option value="">— Pa nënkategori —</option>
                              {subs.map((s) => (<option key={s.id} value={s.name}>{s.name}</option>))}
                            </select>
                          </div>
                        );
                      })()}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Shtëpia Botuese</label>
                          <Input value={editingBook.publisher || ""} onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })} placeholder="p.sh. Onufri" className="bg-background" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Faqe</label>
                          <Input
                            type="text" inputMode="numeric"
                            value={pagesInput}
                            onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setPagesInput(raw); setEditingBook({ ...editingBook, pages: raw === "" ? undefined : parseInt(raw, 10) }); }}
                            onFocus={(e) => e.target.select()}
                            placeholder="320" className="bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Viti</label>
                          <Input
                            type="text" inputMode="numeric"
                            value={yearInput}
                            onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setYearInput(raw); setEditingBook({ ...editingBook, year: raw === "" ? undefined : parseInt(raw, 10) }); }}
                            onFocus={(e) => e.target.select()}
                            placeholder="2024" className="bg-background"
                          />
                        </div>
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
                      <button onClick={() => { setEditingBook({ ...book }); setPriceInput(String(book.price ?? "")); setDiscountInput(String(book.discount ?? "")); setPagesInput(book.pages ? String(book.pages) : ""); setYearInput(book.year ? String(book.year) : ""); setIsNewBook(false); }} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Ndrysho"><Pencil className="h-4 w-4" /></button>
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
              <p className="text-sm text-muted-foreground">{topLevelCats.length} kategori kryesore · {categories.filter(c => c.parent_id).length} nënkategori</p>
            </div>

            {/* Add new category form */}
            <div className="bg-card border border-border rounded-xl p-5 mb-8 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Shto Kategori / Nënkategori</h3>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <label className="text-xs text-muted-foreground mb-1 block">Emri *</label>
                  <Input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Emri i kategorisë..."
                    className="bg-background"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); }}
                  />
                </div>
                <div className="min-w-[160px]">
                  <label className="text-xs text-muted-foreground mb-1 block">Kategori Prind (për nënkategori)</label>
                  <select
                    value={newCatParentId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setNewCatParentId(pid);
                      // Auto-inherit is_children from parent
                      if (pid) {
                        const parent = topLevelCats.find((c) => c.id === pid);
                        setNewCatIsChildren(parent?.is_children ?? false);
                      } else {
                        setNewCatIsChildren(false);
                      }
                    }}
                    className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground"
                  >
                    <option value="">— Kategori kryesore —</option>
                    {topLevelCats.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                {/* is_children: auto-set from parent, disabled if subcategory */}
                <div className="flex items-center gap-2 pb-1">
                  <input
                    type="checkbox"
                    id="newCatChildren"
                    checked={newCatIsChildren}
                    disabled={!!newCatParentId} // subcategories inherit from parent, can't override
                    onChange={(e) => setNewCatIsChildren(e.target.checked)}
                    className="rounded border-border disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="newCatChildren" className={`text-sm font-medium ${newCatParentId ? "opacity-40 cursor-not-allowed" : ""}`}>
                    Për Fëmijë {newCatParentId && <span className="text-xs text-muted-foreground font-normal">(trashëgohet nga prindi)</span>}
                  </label>
                </div>
                <Button onClick={handleAddCategory} disabled={savingCat || !newCatName.trim()} className="gap-2 shrink-0">
                  {savingCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Shto
                </Button>
              </div>
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
              <div className="space-y-3">
                {topLevelCats.map((cat) => {
                  const subcats = categories.filter((c) => c.parent_id === cat.id);
                  return (
                    <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden">
                      {/* Parent category row */}
                      <div className="flex items-center gap-3 p-4">
                        {editingCat?.id === cat.id ? (
                          <>
                            <Input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} className="bg-background flex-1" onKeyDown={(e) => { if (e.key === "Enter") handleUpdateCategory(); }} autoFocus />
                            <div className="flex items-center gap-1.5">
                              <input type="checkbox" id={`ec-${cat.id}`} checked={editCatIsChildren} onChange={(e) => setEditCatIsChildren(e.target.checked)} className="rounded border-border" />
                              <label htmlFor={`ec-${cat.id}`} className="text-xs">Për Fëmijë</label>
                            </div>
                            <Button size="sm" onClick={handleUpdateCategory} disabled={savingCat} className="gap-1">{savingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}Ruaj</Button>
                            <Button size="sm" variant="outline" onClick={() => { setEditingCat(null); setEditCatName(""); setEditCatIsChildren(false); }}>Anulo</Button>
                          </>
                        ) : (
                          <>
                            <Tag className="h-4 w-4 text-primary shrink-0" />
                            <span className="flex-1 text-sm font-semibold">{cat.name}</span>
                            {cat.is_children && <span className="text-xs bg-yellow-400/20 text-yellow-600 px-2 py-0.5 rounded-full font-medium">🧒 Fëmijë</span>}
                            <span className="text-xs text-muted-foreground">{books.filter(b => b.genre === cat.name).length} libra</span>
                            <button onClick={() => { setEditingCat(cat); setEditCatName(cat.name); setEditCatIsChildren(cat.is_children); }} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteCategory(cat.id)} disabled={deletingCat === cat.id} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                              {deletingCat === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </>
                        )}
                      </div>
                      {/* Subcategory rows */}
                      {subcats.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-3 px-4 py-3 border-t border-border/50 bg-muted/30">
                          {editingCat?.id === sub.id ? (
                            <>
                              <span className="w-4 text-muted-foreground/40 text-xs">↳</span>
                              <Input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} className="bg-background flex-1 h-8 text-sm" onKeyDown={(e) => { if (e.key === "Enter") handleUpdateCategory(); }} autoFocus />
                              <Button size="sm" onClick={handleUpdateCategory} disabled={savingCat} className="gap-1 h-8">{savingCat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}Ruaj</Button>
                              <Button size="sm" variant="outline" onClick={() => { setEditingCat(null); setEditCatName(""); }} className="h-8">Anulo</Button>
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground/40 text-xs pl-1">↳</span>
                              <span className="flex-1 text-sm text-muted-foreground">{sub.name}</span>
                              <button onClick={() => { setEditingCat(sub); setEditCatName(sub.name); setEditCatIsChildren(sub.is_children); }} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                              <button onClick={() => handleDeleteCategory(sub.id)} disabled={deletingCat === sub.id} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                                {deletingCat === sub.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ======== USERS / ORDERS TAB ======== */}
        {tab === "users" && (() => {
          // Group orders by user_id
          const orderMap = new Map<string, DbOrder[]>();
          for (const o of orders) {
            const key = o.user_id;
            if (!orderMap.has(key)) orderMap.set(key, []);
            orderMap.get(key)!.push(o);
          }
          // Build userList from profiles (all registered users, even with 0 orders)
          const userList = profiles.map((p) => {
            const userOrders = orderMap.get(p.id) || [];
            return {
              email: p.email,
              registeredAt: p.created_at,
              orders: userOrders,
              total: userOrders.reduce((s, o) => s + (o.total || 0), 0),
            };
          }).sort((a, b) => b.orders.length - a.orders.length);

          // Analytics: orders per day (last 30 days)
          const now = new Date();
          const dayMap = new Map<string, number>();
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dayMap.set(d.toISOString().slice(0, 10), 0);
          }
          for (const o of orders) {
            const day = o.created_at?.slice(0, 10);
            if (day && dayMap.has(day)) dayMap.set(day, (dayMap.get(day) || 0) + 1);
          }
          const chartData = Array.from(dayMap.entries()).map(([date, count]) => ({
            date: date.slice(5), // MM-DD
            porosi: count,
          }));

          return (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Përdorues</p>
                    <p className="text-xl font-bold">{userList.length}</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg"><ShoppingBag className="h-5 w-5 text-green-600" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Porosi Gjithsej</p>
                    <p className="text-xl font-bold">{orders.length}</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><TrendingUp className="h-5 w-5 text-yellow-600" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total të Ardhura</p>
                    <p className="text-xl font-bold">{orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()} Lekë</p>
                  </div>
                </div>
              </div>

              {/* Analytics chart */}
              <div className="bg-card border border-border rounded-xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Porositë — 30 Ditë të Fundit</h3>
                </div>
                {loadingOrders ? (
                  <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(v: number) => [v, "Porosi"]}
                      />
                      <Bar dataKey="porosi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Users list */}
              <div className="mb-4">
                <h2 className="font-serif text-2xl font-bold text-gold">Përdoruesit & Porositë</h2>
                <p className="text-sm text-muted-foreground">{userList.length} përdorues · {orders.length} porosi gjithsej</p>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : userList.length === 0 ? (
                <div className="text-center py-20">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">Asnjë përdorues akoma</h3>
                  <p className="text-muted-foreground">Përdoruesit do të shfaqen këtu pasi të regjistrohen.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userList.map(({ email, orders: userOrders, total }) => (
                    <div key={email} className="bg-card border border-border rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                        onClick={() => setExpandedUser(expandedUser === email ? null : email)}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{email}</p>
                          <p className="text-xs text-muted-foreground">{userOrders.length} porosi · {total > 0 ? `${total.toLocaleString()} Lekë gjithsej` : "Asnjë porosi akoma"}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{expandedUser === email ? "▲" : "▼"}</span>
                      </button>

                      <AnimatePresence>
                        {expandedUser === email && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border/50 divide-y divide-border/30">
                              {userOrders.map((order) => (
                                <div key={order.id} className="px-4 py-3 bg-muted/20">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(order.created_at).toLocaleString("sq-AL", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                      })}
                                    </div>
                                    <span className="text-xs font-bold text-primary">{order.total?.toLocaleString()} Lekë</span>
                                  </div>
                                  <div className="space-y-0.5">
                                    {(order.items || []).map((item, i) => (
                                      <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-foreground/80 truncate max-w-[200px]">{item.title}</span>
                                        <span className="text-muted-foreground shrink-0 ml-2">x{item.quantity} · {(item.price * item.quantity).toLocaleString()} Lekë</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Admin;
