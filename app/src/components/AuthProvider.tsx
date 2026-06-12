// src/components/AuthProvider.tsx
// Client-side auth provider that initializes Supabase session and user state.
// Wraps the app and keeps authStore in sync with Supabase auth.
'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/database';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized, setLoading, initialized } = useAuthStore();

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        return;
      }

      // Fetch user row from our users table
      const { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('auth_uid', session.user.id)
        .maybeSingle();

      if (userRow) {
        setUser(userRow as User);
      } else {
        // Auth session exists but no users row — create one
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            auth_uid: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
            role: 'Admin',
            is_super: true,
          })
          .select()
          .single();

        if (newUser) {
          setUser(newUser as User);
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('AuthProvider: failed to load user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    if (initialized) return;

    // Load user on mount
    loadUser().then(() => setInitialized());

    // Listen for auth state changes (login/logout from other tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, loadUser, setInitialized, setUser]);

  return <>{children}</>;
}
