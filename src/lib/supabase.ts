import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Trajectory = {
  id: string;
  problem: string;
  attempt: string;
  correction: string;
  privacy_mode: string;
  created_at: string;
};
