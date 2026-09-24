"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { initiateDirectGoogleAuth } from "@/lib/googleAuth";

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
      const cleanEmail = email.trim().toLowerCase();

      if (!isSupabaseConfigured()) {
        const err = { message: "Supabase authentication is not configured in this environment." } as AuthError;
        setError(err.message);
        return { data: { user: null, session: null }, error: err };
      }

      try {
        const res = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (res.error) {
          setError(res.error.message);
        } else if (res.data.session) {
          setSession(res.data.session);
          setUser(res.data.user);
        }
        return res;
      } catch (networkErr: any) {
        const err = { message: networkErr?.message || "Failed to authenticate." } as AuthError;
        setError(err.message);
        return { data: { user: null, session: null }, error: err };
      }
    },
    []
  );

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      const err = { message: "Supabase authentication is not configured in this environment." } as AuthError;
      setError(err.message);
      return { data: { user: null, session: null }, error: err };
    }

    try {
      const res = await supabase.auth.signUp({ email: cleanEmail, password });
      if (res.error) {
        setError(res.error.message);
      } else if (res.data.session) {
        setSession(res.data.session);
        setUser(res.data.user);
      }
      return res;
    } catch (networkErr: any) {
      const err = { message: networkErr?.message || "Failed to create account." } as AuthError;
      setError(err.message);
      return { data: { user: null, session: null }, error: err };
    }
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    setError(null);
    try {
      let target = redirectTo || "/client";
      if (typeof window !== "undefined" && target.startsWith(window.location.origin)) {
        target = target.replace(window.location.origin, "");
      }
      await initiateDirectGoogleAuth(target || "/client");
      return { data: { provider: "google" as const, url: null }, error: null };
    } catch (err: any) {
      const errorObj = { message: err?.message || "Google authentication failed." } as AuthError;
      setError(errorObj.message);
      return { data: { provider: "google" as const, url: null }, error: errorObj };
    }
  }, []);

  const signInWithOtp = useCallback(
    async (email: string, emailRedirectTo?: string) => {
      setError(null);
      if (!isSupabaseConfigured()) {
        const err = { message: "Supabase authentication is not configured in this environment." } as AuthError;
        setError(err.message);
        return { data: { user: null, session: null }, error: err };
      }

      const res = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
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
      await supabase.auth.signOut().catch(() => {});
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
    signInWithGoogle,
    signInWithOtp,
    signOut,
    isAuthenticated: Boolean(user),
  };
}
