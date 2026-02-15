import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wcxqkzcrtpnjsnlwehyf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeHFremNydHBuanNubHdlaHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTczNzgsImV4cCI6MjA4NjczMzM3OH0.JwlsTfgtys08jHfGyKzTvN7XkgUSdQ1QKeoCKYFUx6Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
