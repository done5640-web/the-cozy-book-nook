import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wcxqkzcrtpnjsnlwehyf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeHFremNydHBuanNubHdlaHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTczNzgsImV4cCI6MjA4NjczMzM3OH0.JwlsTfgtys08jHfGyKzTvN7XkgUSdQ1QKeoCKYFUx6Y";

// ── PERFORMANCE OPTIMIZATIONS ──────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Faster page load - we don't use OAuth redirects
  },
  global: {
    headers: {
      'x-client-info': 'stacioni-librarise@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  // Connection optimization
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit for realtime (we don't use it much)
    },
  },
});
