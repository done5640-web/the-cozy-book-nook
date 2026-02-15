import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Pencil, LogOut, Loader2, Save, X, Star, Eye, EyeOff, ImageIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { genres } from "@/data/books";

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

const emptyBook: Omit<DbBook, "id" | "created_at"> = {
  title: "",
  author: "",
  price: 0,
  genre: genres[0],
  description: "",
  rating: 0,
  cover: "",
  featured: false,
};

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [books, setBooks] = useState<DbBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Partial<DbBook> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBooks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchBooks();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async () => {
    if (!editingBook?.title || !editingBook?.author || !editingBook?.cover) return;
    setSaving(true);

    if (isNew) {
      const { title, author, price, genre, description, rating, cover, featured } = editingBook;
      const { error } = await supabase.from("books").insert([
        { title, author, price: price || 0, genre: genre || genres[0], description: description || "", rating: rating || 0, cover, featured: featured || false },
      ]);
      if (!error) {
        await fetchBooks();
        setEditingBook(null);
        setIsNew(false);
      }
    } else {
      const { id, created_at, ...updates } = editingBook as DbBook;
      const { error } = await supabase.from("books").update(updates).eq("id", id);
      if (!error) {
        await fetchBooks();
        setEditingBook(null);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
    setDeleting(null);
  };

  const toggleFeatured = async (book: DbBook) => {
    const { error } = await supabase
      .from("books")
      .update({ featured: !book.featured })
      .eq("id", book.id);
    if (!error) {
      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, featured: !b.featured } : b))
      );
    }
  };

  const openNew = () => {
    setEditingBook({ ...emptyBook });
    setIsNew(true);
  };

  const openEdit = (book: DbBook) => {
    setEditingBook({ ...book });
    setIsNew(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-libraria.png" alt="Logo" className="h-8 w-auto" />
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

      <div className="container mx-auto px-4 py-8">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gold">Menaxho Librat</h2>
            <p className="text-sm text-muted-foreground">{books.length} libra gjithsej</p>
          </div>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Shto Libër
          </Button>
        </div>

        {/* Edit/Add Modal */}
        <AnimatePresence>
          {editingBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-10 px-4 overflow-y-auto"
              onClick={(e) => { if (e.target === e.currentTarget) { setEditingBook(null); setIsNew(false); } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mb-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-bold">
                    {isNew ? "Shto Libër të Ri" : "Ndrysho Librin"}
                  </h3>
                  <button onClick={() => { setEditingBook(null); setIsNew(false); }}>
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Titulli *</label>
                    <Input
                      value={editingBook.title || ""}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      placeholder="Emri i librit"
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Autori *</label>
                    <Input
                      value={editingBook.author || ""}
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                      placeholder="Emri i autorit"
                      className="bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Çmimi (Lekë)</label>
                      <Input
                        type="number"
                        value={editingBook.price || 0}
                        onChange={(e) => setEditingBook({ ...editingBook, price: parseInt(e.target.value) || 0 })}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Vlerësimi (0-5)</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editingBook.rating || 0}
                        onChange={(e) => setEditingBook({ ...editingBook, rating: parseFloat(e.target.value) || 0 })}
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Zhanri</label>
                    <select
                      value={editingBook.genre || genres[0]}
                      onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                      className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground"
                    >
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">URL e Fotos (Cover) *</label>
                    <Input
                      value={editingBook.cover || ""}
                      onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="bg-background"
                    />
                    {editingBook.cover && (
                      <img
                        src={editingBook.cover}
                        alt="Preview"
                        className="mt-2 h-32 object-cover rounded-lg border border-border"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Përshkrimi</label>
                    <Textarea
                      value={editingBook.description || ""}
                      onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                      rows={3}
                      placeholder="Përshkrimi i librit..."
                      className="bg-background"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={editingBook.featured || false}
                      onChange={(e) => setEditingBook({ ...editingBook, featured: e.target.checked })}
                      className="rounded border-border"
                    />
                    <label htmlFor="featured" className="text-sm font-medium flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-primary" /> Shfaqe në Kreu (Featured)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isNew ? "Shto" : "Ruaj"}
                    </Button>
                    <Button variant="outline" onClick={() => { setEditingBook(null); setIsNew(false); }}>
                      Anulo
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">Asnjë libër</h3>
            <p className="text-muted-foreground mb-6">Filloni duke shtuar librin e parë.</p>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Shto Libër
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-lg shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-serif font-semibold text-sm truncate">{book.title}</h3>
                    {book.featured && (
                      <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                        Kreu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium">{book.price} Lekë</span>
                    <span className="text-xs text-muted-foreground">{book.genre}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {book.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleFeatured(book)}
                    className={`p-2 rounded-lg transition-colors ${
                      book.featured
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    title={book.featured ? "Hiq nga Kreu" : "Shto në Kreu"}
                  >
                    {book.featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(book)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Ndrysho"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    disabled={deleting === book.id}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Fshi"
                  >
                    {deleting === book.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
