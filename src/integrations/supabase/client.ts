// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ispcrmlpeyfpvxljnhxk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcGNybWxwZXlmcHZ4bGpuaHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDEzNTYsImV4cCI6MjA2MTc3NzM1Nn0.eiXZkkfmJOXFXRoW_GD_50yEvNO7qUhQFvwzsyBxK5M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);