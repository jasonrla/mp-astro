import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ofhwffpwaxosxxrqblic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maHdmZnB3YXhvc3h4cnFibGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjAyNjYsImV4cCI6MjA2OTMzNjI2Nn0.KHUgyj96ddGn3ndKCkZkFfkIkFsJDluYK9t9MNoVOLw";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase as s };
