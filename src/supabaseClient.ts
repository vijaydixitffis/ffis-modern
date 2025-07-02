import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tugnxvgubmjisuexvmzn.supabase.co'; // your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z254dmd1Ym1qaXN1ZXh2bXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTIxOTIsImV4cCI6MjA2NzAyODE5Mn0.xxm0CkWg7V3wb4y7swZVW_cjRxT2cA3_h5ghH5iNBvo'; // your anon/public API key
export const supabase = createClient(supabaseUrl, supabaseKey);