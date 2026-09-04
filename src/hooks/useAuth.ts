"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (!isSupabaseConfigured()) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError((err as Error)?.message || "Failed to initialize auth session");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    if (!isSupabaseConfigured()) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      setError(null);
      if (!isSupabaseConfigured()) {
        // Fallback mock sign in for development/testing
        const mockUser = {
          id: "demo-client-user-id",
          email,
          aud: "authenticated",
          role: "authenticated",
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(mockUser);
        return { data: { user: mockUser, session: null }, error: null };
      }

      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) setError(res.error.message);
      return res;
    },
    []
  );

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      const mockUser = {
        id: "demo-client-user-id",
        email,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      return { data: { user: mockUser, session: null }, error: null };
    }

    const res = await supabase.auth.signUp({ email, password });
    if (res.error) setError(res.error.message);
    return res;
  }, []);

  const signInWithOtp = useCallback(
    async (email: string, emailRedirectTo?: string) => {
      setError(null);
      if (!isSupabaseConfigured()) {
        return { data: { user: null, session: null }, error: null };
      }

      const res = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            emailRedirectTo ||
            (typeof window !== "undefined" ? window.location.href : undefined),
        },
      });
      if (res.error) setError(res.error.message);
      return res;
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signInWithPassword,
    signUp,
    signInWithOtp,
    signOut,
    isAuthenticated: Boolean(user),
  };
}
