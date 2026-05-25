import { createClient } from "@supabase/supabase-js";

// Gunakan hanya di server (Server Actions / API Routes).
// Service role key memberikan akses penuh ke Storage, jangan expose ke client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
