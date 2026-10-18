import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singletons — criados apenas quando a função é chamada pela primeira vez,
// nunca em tempo de build (quando as env vars não estão disponíveis).

let _supabase: SupabaseClient | null = null;

/**
 * Cliente público (anon key) — para leitura de produtos.
 * Respeita as RLS policies de leitura pública.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}

/**
 * Cliente admin (service_role key) — apenas no servidor.
 * Bypassa RLS para writes seguros (reservas, update de produtos).
 * NUNCA expor ao cliente browser.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
