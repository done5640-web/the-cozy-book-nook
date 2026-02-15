import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wcxqkzcrtpnjsnlwehyf.supabase.co";
const supabaseAnonKey = "sb_publishable_idvavP6wlrcHvuEEIOklsw_n8X_Iq3v";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
