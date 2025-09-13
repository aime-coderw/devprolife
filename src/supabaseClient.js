import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zyjrctjhrhwkwljdrqlw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5anJjdGpocmh3a3dsamRycWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNDQyMTksImV4cCI6MjA3MDkyMDIxOX0.MJbbUX6xQWTlfxWqXtZ43_CZYoRM8PVJOqREcM-nR9w";
export const supabase = createClient(supabaseUrl, supabaseKey);
