import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError("Email ose fjalëkalimi i gabuar.");
    }
    setSubmitting(false);
  };

  return (
    <div className="h-[100svh] overflow-hidden bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <img src="/logo-libraria.png" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-brand text-2xl font-bold text-primary uppercase tracking-wider">Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">Hyni në panelin e administrimit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              className="bg-background border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Fjalëkalimi</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background border-border"
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Hyr
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
