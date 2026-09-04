import { createClient } from "@supabase/supabase-js";

function isOpaqueSupabaseKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // Modern Supabase publishable keys are opaque strings, not bearer JWTs.
    if (
      isOpaqueSupabaseKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

const supabaseUrl =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
  process.env["SUPABASE_URL"] ||
  process.env["VITE_SUPABASE_URL"] ||
  "";

const supabaseAnonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
  process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["SUPABASE_ANON_KEY"] ||
  process.env["VITE_SUPABASE_ANON_KEY"] ||
  "";

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("placeholder-project") &&
    supabaseAnonKey !== "placeholder-anon-key"
  );
};

function createSupabaseInstance() {
  const url = supabaseUrl || "https://placeholder-project.supabase.co";
  const key = supabaseAnonKey || "placeholder-anon-key";

  return createClient(url, key, {
    global: {
      fetch: createSupabaseFetch(key),
    },
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseInstance> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseInstance>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseInstance();
    return Reflect.get(_supabase, prop, receiver);
  },
});
