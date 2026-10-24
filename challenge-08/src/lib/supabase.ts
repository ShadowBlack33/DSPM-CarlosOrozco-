import { createClient } from '@supabase/supabase-js';

// Una sola instancia del cliente para toda la app (credenciales en .env)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
);
