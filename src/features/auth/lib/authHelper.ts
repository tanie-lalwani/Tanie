import { NextRequest } from "next/server";
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

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const SUPABASE_URL =
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"];

  const SUPABASE_KEY =
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["SUPABASE_ANON_KEY"] ||
    process.env["VITE_SUPABASE_ANON_KEY"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized: Missing or invalid authorization header", status: 401 };
  }

  const token = authHeader.replace("Bearer ", "");

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { error: "Missing Supabase configuration environment variables", status: 500 };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_KEY),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user || !data.user.id) {
      return { error: "Unauthorized: Invalid or expired auth token", status: 401 };
    }

    return { supabase, userId: data.user.id, user: data.user };
  } catch (err: unknown) {
    return { error: (err as Error)?.message || "Auth verification failed", status: 401 };
  }
}
