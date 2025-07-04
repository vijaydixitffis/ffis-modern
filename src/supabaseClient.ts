import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
console.log('Supabase URL:', supabaseUrl); // Add this line for debugging
export const supabase = createClient(supabaseUrl, supabaseKey);