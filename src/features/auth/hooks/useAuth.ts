"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

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
      // Check for saved test reviewer session first
      if (typeof window !== "undefined") {
        const savedReviewer = localStorage.getItem("tanie_reviewer_user");
        if (savedReviewer) {
          try {
            const parsed = JSON.parse(savedReviewer);
            if (isMounted) {
              setUser(parsed);
              setLoading(false);
              return;
            }
          } catch {
            localStorage.removeItem("tanie_reviewer_user");
          }
        }
      }

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
        if (currentSession?.user) {
          setUser(currentSession.user);
        }
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

      // Special handling for Razorpay Test / Reviewer Account
      if (cleanEmail === "wordsofvoice2210@gmail.com" && password === "Ant!l0pe") {
        const reviewerUser = {
          id: "razorpay-reviewer-user-id",
          email: "wordsofvoice2210@gmail.com",
          aud: "authenticated",
          role: "authenticated",
          user_metadata: {
            full_name: "Words of Voice (Razorpay Verification)",
            company_name: "Razorpay Compliance & Review",
          },
        } as unknown as User;

        if (typeof window !== "undefined") {
          localStorage.setItem("tanie_reviewer_user", JSON.stringify(reviewerUser));
        }
        setUser(reviewerUser);
        return { data: { user: reviewerUser, session: null }, error: null };
      }

      if (!isSupabaseConfigured()) {
        const mockUser = {
          id: "demo-user-id",
          email: cleanEmail,
          aud: "authenticated",
          role: "authenticated",
          user_metadata: {
            full_name: cleanEmail.split("@")[0],
          },
        } as unknown as User;
        setUser(mockUser);
        return { data: { user: mockUser, session: null }, error: null };
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        setError(authError.message);
        return { data: null, error: authError };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
      }

      return { data, error: null };
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, metadata?: Record<string, unknown>) => {
      setError(null);
      const cleanEmail = email.trim().toLowerCase();

      if (!isSupabaseConfigured()) {
        const mockUser = {
          id: "demo-user-id",
          email: cleanEmail,
          aud: "authenticated",
          role: "authenticated",
          user_metadata: {
            full_name: (metadata?.["full_name"] as string) || cleanEmail.split("@")[0],
            ...metadata,
          },
        } as unknown as User;
        setUser(mockUser);
        return { data: { user: mockUser, session: null }, error: null };
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: metadata,
        },
      });

      if (authError) {
        setError(authError.message);
        return { data: null, error: authError };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
      }

      return { data, error: null };
    },
    []
  );

  const signOut = useCallback(async () => {
    setError(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("tanie_reviewer_user");
    }

    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return { error: null };
    }

    const { error: authError } = await supabase.auth.signOut();
    if (authError) {
      setError(authError.message);
      return { error: authError };
    }

    setUser(null);
    setSession(null);
    return { error: null };
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      return { data: {}, error: null };
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : undefined;

    const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    if (resetError) {
      setError(resetError.message);
      return { data: null, error: resetError };
    }

    return { data, error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setError(null);
    if (!isSupabaseConfigured()) {
      return { data: {}, error: null };
    }

    const { data, error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      return { data: null, error: updateError };
    }

    return { data, error: null };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: Boolean(user),
    signInWithPassword,
    signUp,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
  };
}
