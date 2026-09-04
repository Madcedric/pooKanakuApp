'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/database';

function setAuthCookies(accessToken: string, refreshToken: string) {
  const maxAge = 60 * 60 * 24 * 7;
  const attrs = `path=/; max-age=${maxAge}; samesite=lax; secure`;
  document.cookie = `sb-access-token=${accessToken}; ${attrs}`;
  document.cookie = `supabase-auth-token=${accessToken}; ${attrs}`;
  document.cookie = `sb-refresh-token=${refreshToken}; ${attrs}`;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setUser, setInitialized, setLoading, initialized } = useAuthStore();

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        return;
      }

      setAuthCookies(session.access_token, session.refresh_token);

      const { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('auth_uid', session.user.id)
        .maybeSingle();

      if (userRow) {
        setUser(userRow as User);
      } else {
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

        setUser(newUser ? (newUser as User) : null);
      }
    } catch (err) {
      console.error('AuthProvider: failed to load user', err);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized();
    }
  }, [setUser, setLoading, setInitialized]);

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.access_token && session?.refresh_token) {
            setAuthCookies(session.access_token, session.refresh_token);
          }
          await loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
